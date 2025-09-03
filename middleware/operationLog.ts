/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-30 16:00:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-03 17:24:06
 * @FilePath: \express\middleware\operationLog.ts
 * @Description: 操作日志中间件
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

import { NextFunction, Request, Response } from 'express'
import operationLogService from '../service/operationLogService'

interface AuthenticatedRequest extends Request {
  auth?: {
    user_id: number
    user_name: string
  }
}

/**
 * 操作日志中间件
 * 自动记录用户的操作行为
 */
export const operationLogMiddleware = (
  module: string,
  operationType: string,
  description: string
) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const startTime = Date.now()
    const originalSend = res.send

    // 重写res.send方法以捕获响应数据
    res.send = function (data) {
      const executionTime = Date.now() - startTime

      // 异步记录日志，不阻塞响应
      setTimeout(async () => {
        try {
          const logData = {
            user_id: req.auth?.user_id,
            user_name: req.auth?.user_name,
            operation_type: operationType,
            module: module,
            description: description,
            request_url: req.originalUrl || req.url,
            request_method: req.method,
            request_params: JSON.stringify({
              query: req.query,
              body: req.body,
              params: req.params
            }),
            response_data: typeof data === 'string' ? data : JSON.stringify(data),
            ip_address:
              req.ip || req.connection.remoteAddress || (req.headers['x-forwarded-for'] as string),
            user_agent: req.headers['user-agent'],
            status_code: res.statusCode,
            execution_time: executionTime
          }

          await operationLogService.createLog(logData)
        } catch (error) {
          console.error('记录操作日志失败:', error)
        }
      }, 0)

      // 调用原始的send方法
      return originalSend.call(this, data)
    }

    next()
  }
}

/**
 * 通用操作日志中间件
 * 根据请求路径和方法自动判断操作类型
 */
export const autoOperationLogMiddleware = () => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const startTime = Date.now()
    const originalSend = res.send

    // 重写res.send方法以捕获响应数据
    res.send = function (data) {
      const executionTime = Date.now() - startTime

      // 异步记录日志，不阻塞响应
      setTimeout(async () => {
        try {
          // 自动判断操作类型
          let operationType = 'QUERY'
          let module = 'unknown'
          let description = ''

          // 根据请求方法判断操作类型
          switch (req.method) {
            case 'GET':
              operationType = 'QUERY'
              break
            case 'POST':
              operationType = 'CREATE'
              break
            case 'PUT':
            case 'PATCH':
              operationType = 'UPDATE'
              break
            case 'DELETE':
              operationType = 'DELETE'
              break
            default:
              operationType = 'OTHER'
          }

          // 根据请求路径判断模块
          if (req.path.includes('/user')) {
            module = 'user'
          } else if (req.path.includes('/expenses')) {
            module = 'expenses'
          } else if (req.path.includes('/login')) {
            module = 'login'
          } else if (req.path.includes('/operation-logs')) {
            module = 'operation_log'
          }

          // 生成描述
          description = `${req.method} ${req.path} - ${operationType}`

          const logData = {
            user_id: req.auth?.user_id,
            user_name: req.auth?.user_name,
            operation_type: operationType,
            module: module,
            description: description,
            request_url: req.originalUrl || req.url,
            request_method: req.method,
            request_params: JSON.stringify({
              query: req.query,
              body: req.body,
              params: req.params
            }),
            response_data: typeof data === 'string' ? data : JSON.stringify(data),
            ip_address:
              req.ip || req.connection.remoteAddress || (req.headers['x-forwarded-for'] as string),
            user_agent: req.headers['user-agent'],
            status_code: res.statusCode,
            execution_time: executionTime
          }

          await operationLogService.createLog(logData)
        } catch (error) {
          console.error('记录操作日志失败:', error)
        }
      }, 0)

      // 调用原始的send方法
      return originalSend.call(this, data)
    }

    next()
  }
}

/**
 * 跳过日志记录的中间件
 * 用于某些不需要记录日志的接口
 */
export const skipOperationLog = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 标记跳过日志记录
    ;(req as any).skipLog = true
    next()
  }
}
