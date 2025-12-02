/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-12-02 15:57:02
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-02 15:57:11
 * @FilePath: \wanWan\util\cache.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import redis from '../db/redis'

export const cache = {
  async get(key: string) {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  },

  async set(key: string, value: any, ttl = 600) {
    return redis.set(key, JSON.stringify(value), 'EX', ttl)
  },

  async del(key: string) {
    return redis.del(key)
  }
}
