# 启动操作日志模块的步骤

## 🚀 快速启动步骤

### 1. 首先执行数据库脚本

在 MySQL 中执行以下命令创建操作日志表：

```sql
-- 连接到你的数据库
mysql -u root -p test_express

-- 执行初始化脚本
source db/init_operation_log.sql
```

或者直接复制以下 SQL 执行：

```sql
USE test_express;

CREATE TABLE IF NOT EXISTS `operation_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL COMMENT '操作用户ID',
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '操作用户名称',
  `operation_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '操作类型：CREATE, UPDATE, DELETE, QUERY, LOGIN, LOGOUT',
  `module` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '操作模块：user, expenses, login等',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '操作描述',
  `request_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '请求URL',
  `request_method` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '请求方法：GET, POST, PUT, DELETE',
  `request_params` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '请求参数',
  `response_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '响应数据',
  `ip_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'IP地址',
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '用户代理',
  `status_code` int NULL DEFAULT NULL COMMENT '响应状态码',
  `execution_time` int NULL DEFAULT NULL COMMENT '执行时间(毫秒)',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id` (`user_id`) USING BTREE,
  INDEX `idx_operation_type` (`operation_type`) USING BTREE,
  INDEX `idx_module` (`module`) USING BTREE,
  INDEX `idx_create_time` (`create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '操作日志表' ROW_FORMAT = Dynamic;
```

### 2. 启动服务

```bash
npm run dev
```

### 3. 测试日志记录

现在当你调用任何 API 接口时，操作日志都会自动记录到数据库中。

## 🔍 验证日志是否工作

### 方法 1: 查看数据库

```sql
SELECT * FROM operation_log ORDER BY create_time DESC LIMIT 10;
```

### 方法 2: 调用日志查询接口

```
GET /api/operation-logs
```

## ⚠️ 常见问题

### 问题 1: 没有日志记录

- 检查数据库表是否创建成功
- 检查中间件是否正确注入
- 检查控制台是否有错误信息

### 问题 2: 中间件报错

- 检查文件路径是否正确
- 检查导入语法是否正确
- 检查 TypeScript 编译是否成功

## 📝 当前配置状态

✅ `app.ts` - 已添加自动日志中间件
✅ `middleware/operationLog.ts` - 中间件文件已创建
✅ `service/operationLogService.ts` - 服务层已创建
✅ `db/init_operation_log.sql` - 数据库脚本已准备

## 🎯 下一步

1. 执行数据库脚本创建表
2. 重启服务
3. 测试接口，查看日志记录
4. 访问 `/api/operation-logs` 查看日志列表
