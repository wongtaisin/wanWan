/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-11 08:22:31
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-02 16:03:08
 * @FilePath: \wanWan\app.ts
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
import routes from './routes/index'

const app = express()
const PORT = Number(process.env.PORT) || 3001 // 从环境变量中获取端口号，默认3001

console.log(`Loaded environment variables from ${envPath}`)

// 信任反向代理，获取真实IP
app.set('trust proxy', true) // ⭐⭐⭐ 必须放在最前面（创建 app 后、任何中间件之前）

app.use(express.static(path.join(__dirname, 'public'))) // 静态资源目录

app.use(bodyParser.urlencoded({ extended: true })) // 解析form表单提交的数据application/x-www-form-urlencoded
app.use(bodyParser.json()) // 解析json数据格式
app.use(bodyParser.text()) //解析 text/plain 数据格式

app.use(cors()) // 注入cors模块解决跨域

app.use(rateLimitMiddleware) // 在所有路由之前注入限流中间件

app.use(autoOperationLogMiddleware()) // 在所有路由之前注入自动日志记录中间件

app.use('/', routes) // 挂载路由模块

app.listen(PORT, () => {
  console.log(`server is running port ${PORT}`) // 启动服务监听端口 3001
})
