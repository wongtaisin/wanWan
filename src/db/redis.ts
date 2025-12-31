/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-12-02 15:10:10
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-02 15:42:38
 * @FilePath: \wanWan\db\redis.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB) || 0,
  lazyConnect: false
})

redis.on('connect', () => {
  console.log('[redis] connect success 🟢')
})

redis.on('error', err => {
  console.error('[redis] connect error 🔴', err)
})

export default redis
