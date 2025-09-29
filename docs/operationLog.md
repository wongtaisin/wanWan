# 操作日志模块使用说明

## 概述

操作日志模块用于记录系统中所有用户的操作行为，包括登录、登出、增删改查等操作。该模块提供了完整的日志记录、查询、统计和管理功能。

## 功能特性

- 自动记录用户操作日志
- 支持多种操作类型（CREATE、UPDATE、DELETE、QUERY、LOGIN、LOGOUT 等）
- 记录详细的请求和响应信息
- 支持按条件查询和分页
- 提供操作统计功能
- 支持日志清理和管理

## 数据库表结构

### operation_log 表

| 字段名         | 类型         | 说明           |
| -------------- | ------------ | -------------- |
| id             | int          | 主键 ID        |
| user_id        | int          | 操作用户 ID    |
| user_name      | varchar(255) | 操作用户名称   |
| operation_type | varchar(50)  | 操作类型       |
| module         | varchar(100) | 操作模块       |
| description    | text         | 操作描述       |
| request_url    | varchar(500) | 请求 URL       |
| request_method | varchar(20)  | 请求方法       |
| request_params | text         | 请求参数       |
| response_data  | text         | 响应数据       |
| ip_address     | varchar(50)  | IP 地址        |
| user_agent     | text         | 用户代理       |
| status_code    | int          | 响应状态码     |
| execution_time | int          | 执行时间(毫秒) |
| create_time    | datetime     | 创建时间       |

## API 接口

### 1. 获取操作日志列表

```
GET /api/operation-logs
```

**查询参数：**

- `page`: 页码（默认 1）
- `pageSize`: 每页大小（默认 10）
- `user_id`: 用户 ID
- `operation_type`: 操作类型
- `module`: 模块名
- `start_time`: 开始时间
- `end_time`: 结束时间
- `keyword`: 关键词搜索

**响应示例：**

```json
{
  "code": 200,
  "msg": "获取操作日志列表成功",
  "data": {
    "total": 100,
    "list": [...],
    "page": 1,
    "pageSize": 10
  }
}
```

### 2. 获取操作日志详情

```
GET /api/operation-logs/:id
```

### 3. 删除操作日志

```
DELETE /api/operation-logs/:id
```

### 4. 批量删除操作日志

```
DELETE /api/operation-logs
```

**请求体：**

```json
{
  "ids": [1, 2, 3]
}
```

### 5. 清理旧日志

```
POST /api/operation-logs/clean
```

**请求体：**

```json
{
  "beforeDate": "2025-08-01"
}
```

### 6. 获取操作统计信息

```
GET /api/operation-logs/stats?days=7
```

## 使用方法

### 1. 自动记录日志（推荐）

在主路由中注入自动日志中间件：

```typescript
import { autoOperationLogMiddleware } from '../middleware/operationLog'

// 在所有路由之前注入
app.use(autoOperationLogMiddleware())
```

### 2. 手动记录日志

在需要记录日志的地方调用工具函数：

```typescript
import { recordCreateLog, recordUpdateLog, recordDeleteLog } from '../util/operationLogUtil'

// 记录创建操作
await recordCreateLog(userId, userName, 'user', '创建新用户', userData)

// 记录更新操作
await recordUpdateLog(userId, userName, 'user', '更新用户信息', updateData)

// 记录删除操作
await recordDeleteLog(userId, userName, 'user', '删除用户', { userId: 123 })
```

### 3. 在现有控制器中使用

在现有的用户、花销等控制器中添加日志记录：

```typescript
// 在用户创建成功后
await recordCreateLog(req.user.user_id, req.user.user_name, 'user', '创建新用户', req.body)

// 在花销记录创建成功后
await recordCreateLog(req.user.user_id, req.user.user_name, 'expenses', '记录新的花销', req.body)
```

## 中间件说明

### operationLogMiddleware

用于特定接口的日志记录，可以指定操作类型和描述：

```typescript
import { operationLogMiddleware } from '../middleware/operationLog'

router.post(
  '/users',
  operationLogMiddleware('user', 'CREATE', '创建新用户'),
  userController.createUser
)
```

### autoOperationLogMiddleware

自动根据请求方法和路径判断操作类型：

```typescript
import { autoOperationLogMiddleware } from '../middleware/operationLog'

// 自动记录所有操作
app.use(autoOperationLogMiddleware())
```

### skipOperationLog

跳过某些接口的日志记录：

```typescript
import { skipOperationLog } from '../middleware/operationLog'

router.get('/health', skipOperationLog(), (req, res) => {
  res.json({ status: 'ok' })
})
```

## 配置说明

### 日志保留策略

可以通过定时任务清理旧日志：

```typescript
// 清理30天前的日志
await operationLogService.cleanOldLogs('2025-07-01')
```

### 性能优化

- 日志记录采用异步方式，不阻塞主流程
- 支持批量操作和分页查询
- 建议定期清理旧日志以保持数据库性能

## 注意事项

1. 确保数据库表已创建
2. 日志记录是异步的，不会影响接口响应速度
3. 敏感信息（如密码）会在记录前被过滤
4. 建议定期清理旧日志以节省存储空间
5. 在生产环境中，可以根据需要调整日志记录的详细程度

## 扩展功能

可以根据需要扩展以下功能：

- 日志导出功能
- 更详细的统计分析
- 日志告警机制
- 日志可视化界面
- 多租户日志隔离
