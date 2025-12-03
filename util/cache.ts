/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-12-02 15:57:02
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-03 09:36:08
 * @FilePath: \wanWan\util\cache.ts
 * @Description: redis 缓存工具类
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import redis from '../db/redis'
const CACHE_TTL_SECONDS = 60 * 60 * 4 // 14,400 秒

export const redisCache = {
  /**
   * @description: 设置缓存
   * @param {string} key 缓存键
   * @param {*} value 缓存值
   * @param {number} [ttl= CACHE_TTL_SECONDS] 缓存过期时间，单位秒
   * @return {*} 设置成功数量
   */
  async set(key: string, value: any, ttl = CACHE_TTL_SECONDS) {
    return redis.set(key, JSON.stringify(value), 'EX', ttl)
  },

  /**
   * @description: 获取缓存
   * @param {string} key 缓存键
   * @return {*} 缓存值
   */
  async get(key: string) {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  },

  /**
   * @description: 删除缓存
   * @param {string} key 缓存键
   * @return {*} 删除成功数量
   */
  async del(key: string) {
    return redis.del(key)
  }
}
