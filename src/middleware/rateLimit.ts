/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-12-04 08:51:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-04 11:46:35
 * @FilePath: \wanWan\middleware\rateLimit.ts
 * @Description: 限流中间件，限制每秒请求不超过10次
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import redis from '../config/redis'

// 限流配置
const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 10, // 每秒最大请求数
  WINDOW_MS: 1000 // 时间窗口（毫秒）
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
    // 使用客户端IP作为限流键，实现每个IP每秒最多10次请求
    const clientIp = req.ip || req.connection.remoteAddress
    const key = `rate_limit:${clientIp}`

    // 获取当前请求计数
    const currentCount = await redis.get(key)
    const count = currentCount ? parseInt(currentCount) : 0

    // 检查是否超过限制
    if (count >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
      return res.status(429).json({
        code: 429,
        message: '请求过于频繁，请稍后再试',
        data: null
      })
    }

    // 增加请求计数
    if (count === 0) {
      // 如果是第一个请求，设置过期时间
      await redis.set(key, 1, 'EX', Math.ceil(RATE_LIMIT_CONFIG.WINDOW_MS / 1000))
    } else {
      // 否则，只增加计数
      await redis.incr(key)
    }

    // 继续处理请求
    next()
  } catch (error) {
    console.error('限流中间件错误:', error)
    // 如果Redis出错，允许请求继续处理，避免影响服务
    next()
  }
}
