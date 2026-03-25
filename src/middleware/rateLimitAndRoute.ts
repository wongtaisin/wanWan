/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-12-04 08:51:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-04 14:28:05
 * @FilePath: \wanWan\middleware\rateLimit.ts
 * @Description: 限流中间件，支持全局限流和接口级限流
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import redis from '../config/redis'

// 全局限流配置
const GLOBAL_RATE_LIMIT = {
  MAX_REQUESTS: 10, // 每秒最大请求数
  WINDOW_MS: 1000 // 时间窗口（毫秒）
}

// 接口级限流配置（优先级高于全局配置）
const ROUTE_RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  // 示例：为特定接口设置1秒1次的限制
  // 'POST:/expensesDetail/add': { maxRequests: 1, windowMs: 1000 },
  // 'GET:/user/info': { maxRequests: 2, windowMs: 1000 },
}

/**
 * @description: 限流中间件
 * @param {any} req - 请求对象
 * @param {any} res - 响应对象
 * @param {any} next - 下一步函数
 * @return {*}
 */
export const rateLimitMiddleware = async (req: any, res: any, next: any) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress // 获取客户端IP
    const routeKey = `${req.method}:${req.path}` // 接口路由键

    // 1. 检查接口级限流
    const routeConfig = ROUTE_RATE_LIMITS[routeKey] // 获取接口级配置
    if (routeConfig) {
      const routeLimitKey = `rate_limit:${clientIp}:${routeKey}` // 接口级限流键
      const routeCount = parseInt((await redis.get(routeLimitKey)) || '0') // 获取接口级计数

      if (routeCount >= routeConfig.maxRequests) {
        return res.status(429).json({
          code: 429,
          message: '请求过于频繁，请稍后再试',
          data: null
        })
      }

      // 更新接口级计数
      if (routeCount === 0) {
        await redis.set(routeLimitKey, 1, 'EX', Math.ceil(routeConfig.windowMs / 1000))
      } else {
        await redis.incr(routeLimitKey)
      }
    }

    // 2. 检查全局限流
    const globalLimitKey = `rate_limit:${clientIp}:global` // 全局限流键
    const globalCount = parseInt((await redis.get(globalLimitKey)) || '0') // 获取全局计数

    if (globalCount >= GLOBAL_RATE_LIMIT.MAX_REQUESTS) {
      return res.status(429).json({
        code: 429,
        message: '请求过于频繁，请稍后再试',
        data: null
      })
    }

    // 更新全局计数
    if (globalCount === 0) {
      await redis.set(globalLimitKey, 1, 'EX', Math.ceil(GLOBAL_RATE_LIMIT.WINDOW_MS / 1000))
    } else {
      await redis.incr(globalLimitKey)
    }

    // 继续处理请求
    next()
  } catch (error) {
    console.error('限流中间件错误:', error)
    // 如果Redis出错，允许请求继续处理，避免影响服务
    next()
  }
}

/**
 * @description: 创建接口级限流中间件
 * @param {number} maxRequests - 最大请求数
 * @param {number} windowMs - 时间窗口（毫秒）
 * @return {Function} 中间件函数
 */
export const createRouteRateLimit = (maxRequests: number, windowMs: number = 1000) => {
  return async (req: any, res: any, next: any) => {
    try {
      const clientIp = req.ip || req.connection.remoteAddress // 获取客户端IP
      const routeKey = `${req.method}:${req.path}` // 接口路由键
      const limitKey = `rate_limit:${clientIp}:${routeKey}` // 接口级限流键

      const count = parseInt((await redis.get(limitKey)) || '0') // 获取接口级计数

      if (count >= maxRequests) {
        return res.status(429).json({
          code: 429,
          message: '请求过于频繁，请稍后再试',
          data: null
        })
      }

      if (count === 0) {
        await redis.set(limitKey, 1, 'EX', Math.ceil(windowMs / 1000))
      } else {
        await redis.incr(limitKey)
      }

      next()
    } catch (error) {
      console.error('接口限流中间件错误:', error)
      next()
    }
  }
}
