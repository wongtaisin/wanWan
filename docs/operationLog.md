# 操作日志模块使用说明

## 概述

操作日志模块用于记录系统中所有用户的操作行为，包括登录、登出、增删改查等操作。该模块提供了完整的日志记录、查询、统计和管理功能。

## 功能特性

- 自动记录用户操作日志（通过中间件）
- 支持多种操作类型（CREATE、UPDATE、DELETE、QUERY、LOGIN、LOGOUT 等）
- 记录详细的请求和响应信息
- 支持按条件查询和分页
- 提供操作统计功能
- 支持日志清理和管理
- 支持跳过指定接口的日志记录

## API 接口

### 基础路径

所有操作日志接口的基础路径为：`/api/operationLog`

### 接口列表

| API 路径       | HTTP 方法 | 功能描述                 |
| -------------- | --------- | ------------------------ |
| `/list`        | GET       | 获取操作日志列表（分页） |
| `/getInfo/:id` | GET       | 获取操作日志详情         |
| `/delete/:id`  | DELETE    | 删除单条操作日志         |
| `/deleteAll`   | DELETE    | 批量删除操作日志         |
| `/clean`       | POST      | 清理指定日期之前的旧日志 |
| `/stats`       | GET       | 获取操作统计信息         |

### 1. 获取操作日志列表

```
GET /api/operationLog/list
```

**查询参数：**

| 参数名        | 类型   | 必填 | 说明                                      |
| ------------- | ------ | ---- | ----------------------------------------- |
| page          | number | 否   | 页码（默认 1）                            |
| pageSize      | number | 否   | 每页大小（默认 10）                       |
| userId        | number | 否   | 操作用户 ID                               |
| operationType | string | 否   | 操作类型（CREATE/UPDATE/DELETE/QUERY 等） |
| module        | string | 否   | 操作模块名称                              |
| startTime     | string | 否   | 开始时间（格式：YYYY-MM-DD HH:MM:SS）     |
| endTime       | string | 否   | 结束时间（格式：YYYY-MM-DD HH:MM:SS）     |
| keyword       | string | 否   | 关键词搜索（匹配描述）                    |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "id": 1,
        "userId": 1,
        "userName": "admin",
        "operationType": "CREATE",
        "module": "expenses",
        "description": "添加花销记录",
        "requestUrl": "/api/expenses/add",
        "requestMethod": "POST",
        "requestParams": "{\"amount\":100,\"description\":\"午餐\"}",
        "responseData": "{\"code\":200,\"message\":\"添加成功\"}",
        "ipAddress": "127.0.0.1",
        "userAgent": "Mozilla/5.0...",
        "statusCode": 200,
        "executionTime": 50,
        "createTime": "2025-12-16 10:30:00"
      }
    ],
    "page": 1,
    "pageSize": 10
  }
}
```

### 2. 获取操作日志详情

```
GET /api/operationLog/getInfo/:id
```

**路径参数：**

| 参数名 | 类型   | 说明        |
| ------ | ------ | ----------- |
| id     | number | 日志记录 ID |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "userId": 1,
    "userName": "admin",
    "operationType": "CREATE",
    "module": "expenses",
    "description": "添加花销记录",
    "requestUrl": "/api/expenses/add",
    "requestMethod": "POST",
    "requestParams": "{\"amount\":100,\"description\":\"午餐\"}",
    "responseData": "{\"code\":200,\"message\":\"添加成功\"}",
    "ipAddress": "127.0.0.1",
    "userAgent": "Mozilla/5.0...",
    "statusCode": 200,
    "executionTime": 50,
    "createTime": "2025-12-16 10:30:00"
  }
}
```

### 3. 删除单条操作日志

```
DELETE /api/operationLog/delete/:id
```

**路径参数：**

| 参数名 | 类型   | 说明        |
| ------ | ------ | ----------- |
| id     | number | 日志记录 ID |

**响应示例：**

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 4. 批量删除操作日志

```
DELETE /api/operationLog/deleteAll
```

**请求体：**

```json
{
  "ids": [1, 2, 3]
}
```

| 参数名 | 类型     | 必填 | 说明                 |
| ------ | -------- | ---- | -------------------- |
| ids    | number[] | 是   | 要删除的日志 ID 数组 |

**响应示例：**

```json
{
  "code": 200,
  "message": "批量删除成功",
  "data": {
    "deletedCount": 3
  }
}
```

### 5. 清理旧日志

```
POST /api/operationLog/clean
```

**请求体：**

```json
{
  "beforeDate": "2025-08-01"
}
```

| 参数名     | 类型   | 必填 | 说明                                     |
| ---------- | ------ | ---- | ---------------------------------------- |
| beforeDate | string | 是   | 清理此日期之前的日志（格式：YYYY-MM-DD） |

**响应示例：**

```json
{
  "code": 200,
  "message": "清理完成",
  "data": {
    "cleanedCount": 50
  }
}
```

### 6. 获取操作统计信息

```
GET /api/operationLog/stats
```

**查询参数：**

| 参数名 | 类型   | 必填 | 说明                   |
| ------ | ------ | ---- | ---------------------- |
| days   | number | 否   | 统计最近天数（默认 7） |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalOperations": 150,
    "todayOperations": 25,
    "dailyStats": [
      { "date": "2025-12-10", "count": 20 },
      { "date": "2025-12-11", "count": 25 },
      { "date": "2025-12-12", "count": 30 }
    ],
    "operationTypeStats": {
      "CREATE": 50,
      "UPDATE": 30,
      "DELETE": 10,
      "QUERY": 60
    },
    "moduleStats": {
      "expenses": 80,
      "user": 30,
      "shop": 25,
      "file": 15
    }
  }
}
```

## 中间件使用

### 1. 自动记录日志（全局中间件）

在应用入口或路由中注入自动日志中间件：

```typescript
import { operationLogMiddleware } from '../middleware/operationLog'

// 在路由配置中使用
app.use('/api', operationLogMiddleware)
```

### 2. 跳过指定接口的日志记录

使用 `skipOperationLog` 中间件跳过特定接口的日志记录：

```typescript
import { skipOperationLog } from '../middleware/operationLog'

router.get('/list', skipOperationLog(), operationLogController.getLogList)
router.get('/getInfo/:id', skipOperationLog(), operationLogController.getLogDetail)
```

### 3. 手动记录日志

在需要手动记录日志的地方使用工具函数：

```typescript
import { recordOperationLog } from '../util/operationLogUtil'

await recordOperationLog({
  userId: 1,
  userName: 'admin',
  operationType: 'CREATE',
  module: 'expenses',
  description: '添加花销记录',
  requestUrl: '/api/expenses/add',
  requestMethod: 'POST',
  requestParams: JSON.stringify(req.body),
  responseData: JSON.stringify(response),
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  statusCode: 200,
  executionTime: 50
})
```

## 数据库表结构

### operation_log 表

| 字段名        | 类型         | 约束                       | 说明             |
| ------------- | ------------ | -------------------------- | ---------------- |
| id            | int          | PRIMARY KEY AUTO_INCREMENT | 主键 ID          |
| userId        | int          | NOT NULL                   | 操作用户 ID      |
| userName      | varchar(255) | NOT NULL                   | 操作用户名称     |
| operationType | varchar(50)  | NOT NULL                   | 操作类型         |
| module        | varchar(100) |                            | 操作模块         |
| description   | text         |                            | 操作描述         |
| requestUrl    | varchar(500) |                            | 请求 URL         |
| requestMethod | varchar(20)  |                            | 请求方法         |
| requestParams | text         |                            | 请求参数（JSON） |
| responseData  | text         |                            | 响应数据（JSON） |
| ipAddress     | varchar(50)  |                            | 客户端 IP 地址   |
| userAgent     | text         |                            | 用户代理         |
| statusCode    | int          |                            | 响应状态码       |
| executionTime | int          |                            | 执行时间（毫秒） |
| createTime    | datetime     | DEFAULT CURRENT_TIMESTAMP  | 创建时间         |

## 操作类型说明

| 操作类型 | 说明     |
| -------- | -------- |
| LOGIN    | 用户登录 |
| LOGOUT   | 用户登出 |
| CREATE   | 创建记录 |
| UPDATE   | 更新记录 |
| DELETE   | 删除记录 |
| QUERY    | 查询记录 |
| UPLOAD   | 上传文件 |
| OTHER    | 其他操作 |

## 使用注意事项

1. **异步记录**：日志记录采用异步方式，不会阻塞主流程
2. **敏感信息过滤**：密码等敏感信息会在记录前被自动过滤
3. **性能优化**：建议定期清理旧日志以保持数据库性能
4. **日志查询权限**：应限制操作日志的查询权限，只允许管理员访问
5. **日志保留策略**：根据业务需求设置合理的日志保留期限（如 90 天）

## 扩展建议

- 日志导出功能（支持 Excel、CSV 格式）
- 日志告警机制（异常操作自动告警）
- 日志可视化仪表盘
- 多租户日志隔离
- 日志检索优化（全文搜索）
