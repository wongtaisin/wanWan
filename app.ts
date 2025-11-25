/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-11 08:22:31
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-25 16:20:35
 * @FilePath: \wanWan\app.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser') // 引入body-parser模块
const cors = require('cors')
const routes = require('./routes')
const { autoOperationLogMiddleware } = require('./middleware/operationLog') // 引入操作日志中间件
const app = express()

// 信任反向代理，获取真实IP
app.set('trust proxy', true) // ⭐⭐⭐ 必须放在最前面（创建 app 后、任何中间件之前）

app.use(express.static(path.join(__dirname, 'public'))) // 静态资源目录

app.use(bodyParser.urlencoded({ extended: true })) // 解析form表单提交的数据application/x-www-form-urlencoded
app.use(bodyParser.json()) // 解析json数据格式
app.use(bodyParser.text()) //解析 text/plain 数据格式

app.use(cors()) // 注入cors模块解决跨域

// 在所有路由之前注入自动日志记录中间件
app.use(autoOperationLogMiddleware())

app.use('/', routes) // 挂载路由模块

app.listen(3001, () => {
  console.log('server is running port 3001') // 启动服务监听端口 3001
})
