/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-30 16:00:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-25 16:52:48
 * @FilePath: \wanWan\routes\operationLog.ts
 * @Description: 操作日志路由
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

import express from 'express'
import operationLogController from '../controllers/operationLogController'
import { skipOperationLog } from '../middleware/operationLog' // 跳过接口的日志记录

const router = express.Router()

// 获取操作日志列表
router.get('/operation-logs', skipOperationLog(), operationLogController.getLogList)

// 获取操作日志详情
router.get('/operation-logs/:id', skipOperationLog(), operationLogController.getLogDetail)

// 删除操作日志
router.delete('/operation-logs/:id', operationLogController.deleteLog)

// 批量删除操作日志
router.delete('/operation-logs', operationLogController.batchDeleteLog)

// 清理旧日志
router.post('/operation-logs/clean', operationLogController.cleanOldLogs)

// 获取操作统计信息
router.get('/operationLogs/stats', operationLogController.getOperationStats)

export default router
