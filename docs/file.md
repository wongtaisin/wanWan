# 文件管理模块使用说明

## 概述

文件管理模块用于处理系统中的文件上传、存储和删除操作，基于 Express + Sequelize ORM 构建。模块提供了文件上传、删除、查询等功能，支持将文件元数据存储到 MySQL 数据库。

## 技术栈

- **框架**: Express 5.x
- **ORM**: Sequelize 6.x
- **缓存**: Redis（用于文件去重检测）
- **文件上传**: Multer
- **数据库**: MySQL

## API 接口

### 基础路径

`/api/file`

### 接口列表

| API 路径              | HTTP 方法 | 功能描述     |
| --------------------- | --------- | ------------ |
| `/file/base/upload`   | POST      | 基础文件上传 |
| `/file/base/file/:id` | DELETE    | 删除指定文件 |

### 1. 文件上传

```
POST /api/file/base/upload
```

**请求体（multipart/form-data）：**

| 字段名 | 类型   | 必填 | 说明                          |
| ------ | ------ | ---- | ----------------------------- |
| file   | File   | 是   | 要上传的文件                  |
| module | string | 否   | 文件所属模块（expenses/shop） |
| remark | string | 否   | 文件备注说明                  |

**查询参数：**

| 参数名 | 类型   | 必填 | 说明                   |
| ------ | ------ | ---- | ---------------------- |
| source | string | 否   | 来源标识（如 TinyMCE） |

**成功响应：**

```json
{
  "code": 0,
  "message": "上传文件成功",
  "data": {
    "id": 1,
    "url": "/uploads/a1b2c3d4e5f6.png",
    "suffix": "png",
    "module": "expenses",
    "remark": "花销凭证"
  }
}
```

**TinyMCE 来源响应：**

```json
{
  "location": "/uploads/a1b2c3d4e5f6.png",
  "id": 1
}
```

**失败响应（文件过大）：**

```json
{
  "code": -1,
  "message": "超过限制大小10MB",
  "errors": ["错误详情"]
}
```

### 2. 删除文件

```
DELETE /api/file/base/file/:id
```

**路径参数：**

| 参数名 | 类型   | 说明        |
| ------ | ------ | ----------- |
| id     | number | 文件记录 ID |

**成功响应：**

```json
{
  "code": 0,
  "message": "删除文件成功",
  "data": null
}
```

**失败响应（文件不存在）：**

```json
{
  "code": -1,
  "message": "删除文件失败",
  "errors": ["错误详情"]
}
```

## Sequelize 模型

### File 模型定义

```typescript
import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class File extends Model {}

File.init(
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '文件URL'
    },
    suffix: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '文件后缀类型'
    },
    module: {
      type: DataTypes.ENUM('expenses', 'shop'),
      allowNull: true,
      comment: '文件所属模块'
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '文件备注'
    }
  },
  {
    sequelize,
    modelName: 'File',
    tableName: 'file',
    timestamps: true,
    createdAt: 'created_date',
    updatedAt: 'update_date'
  }
)
```

## 数据库表结构

### file 表

| 字段名       | 类型                    | 约束                                | 说明         |
| ------------ | ----------------------- | ----------------------------------- | ------------ |
| id           | int                     | PRIMARY KEY AUTO_INCREMENT          | 主键 ID      |
| url          | varchar(255)            | NOT NULL                            | 文件访问路径 |
| suffix       | varchar(50)             |                                     | 文件后缀类型 |
| module       | enum('expenses','shop') |                                     | 所属模块     |
| remark       | varchar(255)            |                                     | 备注说明     |
| created_date | datetime                | DEFAULT CURRENT_TIMESTAMP           | 创建时间     |
| update_date  | datetime                | DEFAULT CURRENT_TIMESTAMP ON UPDATE | 更新时间     |

## 核心实现

### 文件命名策略

上传文件使用 MD5 哈希值命名，实现文件去重：

```typescript
const hash = crypto.createHash('md5').update(file.originalname).digest('hex')
const ext = path.extname(file.originalname)
cb(null, `${hash}${ext}`)
```

### 文件上传流程

```
1. 接收 multipart/form-data 请求
2. Multer 中间件处理文件上传，存入临时目录
3. 计算文件 MD5 哈希值
4. 检查数据库中是否已存在相同 URL 的记录
5. 如果已存在：
   - 删除临时文件
   - 返回已存在的记录
6. 如果不存在：
   - 将临时文件重命名为 MD5 格式
   - 保存文件记录到数据库
   - 返回新记录
```

### 文件删除流程

```
1. 根据 ID 查询文件记录
2. 检查同 URL 的文件引用数量
3. 如果引用数为 1：删除物理文件
4. 删除数据库记录
5. 返回结果
```

### 响应工具函数

项目使用统一的响应工具：

```typescript
// 成功响应
ReSuccess(res, code, message, data)

// 失败响应
ReFail(res, message, error)

// 图片上传成功（支持 TinyMCE）
imgSuccess(res, source, img)
```

## 环境变量

| 变量名           | 说明                     | 默认值    |
| ---------------- | ------------------------ | --------- |
| FILE_UPLOAD_SIZE | 文件上传大小限制（字节） | -         |
| REDIS_HOST       | Redis 主机               | 127.0.0.1 |
| REDIS_PORT       | Redis 端口               | 6379      |

## 注意事项

1. **文件去重**：基于文件名 MD5 哈希去重，相同文件名只存储一份
2. **引用计数**：删除时检查引用次数，仅当引用为 1 时删除物理文件
3. **文件访问**：上传文件通过 `/uploads/{文件名}` 路径访问
4. **来源适配**：可通过 source 参数适配不同前端（如 TinyMCE）
5. **错误处理**：文件过大时延迟 500ms 返回错误，确保日志中间件处理完成

## 使用示例

### 前端上传（JavaScript）

```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('module', 'expenses')
formData.append('remark', '花销凭证')

fetch('/api/file/base/upload', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => {
    if (data.code === 0) {
      console.log('上传成功，文件URL:', data.data.url)
    }
  })
```

### cURL

```bash
curl -X POST -F "file=@test.png" -F "module=expenses" http://localhost:3001/api/file/base/upload

curl -X DELETE http://localhost:3001/api/file/base/file/1
```

## 扩展建议

- 添加文件类型白名单验证
- 支持多文件批量上传
- 实现图片压缩功能
- 添加文件下载接口
- 支持阿里云 OSS/七牛云等云存储
