/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-11 08:22:31
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-02-07 11:39:02
 * @FilePath: \wanWan\src\app.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import dotenv from 'dotenv' // 引入dotenv模块,用于加载环境变量
const envPath = `.env.${process.env.NODE_ENV || 'development'}`
dotenv.config({ path: envPath }) // 加载环境变量后,可以通过process.env访问到环境变量
/* end 加载环境变量，必须在头部 */

import bodyParser from 'body-parser' // 引入body-parser模块，用于解析请求体数据
import cors from 'cors' // 引入cors模块，用于解决跨域问题
import express from 'express' // 引入express模块，用于创建应用
import path from 'path' // 引入path模块，用于处理文件路径
import { autoOperationLogMiddleware } from './middleware/operationLog' // 引入操作日志中间件
import { rateLimitMiddleware } from './middleware/rateLimit' // 引入限流中间件
import jwtAuth from './util/jwt'

import routes from './routes/index'

const app = express()
const PORT = Number(process.env.PORT) || 3001 // 从环境变量中获取端口号，默认3001

console.log(`Loaded environment variables from ${envPath}`)

// 信任反向代理，获取真实IP
app.set('trust proxy', true) // ⭐⭐⭐ 必须放在最前面（创建 app 后、任何中间件之前）

// 先处理静态资源请求，直接返回，不经过后续中间件
// 使用绝对路径配置静态资源中间件，确保静态资源请求被正确处理
app.use(express.static(path.join(process.cwd(), 'dist_web')))
app.use(express.static(path.join(process.cwd(), 'public')))

// 然后处理API请求的中间件
app.use(bodyParser.urlencoded({ extended: true })) // 解析form表单提交的数据application/x-www-form-urlencoded
app.use(bodyParser.json()) // 解析json数据格式
app.use(bodyParser.text()) //解析 text/plain 数据格式

app.use(cors()) // 注入cors模块解决跨域

// API 路由专属中间件链：限流 -> 操作日志 -> JWT 认证 -> 路由
app.use('/api', rateLimitMiddleware, autoOperationLogMiddleware(), jwtAuth, routes)

// 这个路由必须放在最后，只处理API路由未匹配的请求，用户访问其他路径，返回前端的入口 HTML 文件 - SPA应用的前端路由处理
app.get(/^(.*)$/, (_req, res) => {
  // 前面已挂载 /api，未命中的 API 不会落到这里，因此无需再判定 /api
  res.sendFile(path.join(__dirname, './dist_web', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`server is running port ${PORT}`) // 启动服务监听端口 3001
})
