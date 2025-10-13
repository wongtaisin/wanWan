/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-10-13 15:52:35
 * @FilePath: \wanWan\routes\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express'
const userRouter = require('./user')
const loginRouter = require('./login')
const expensesRouter = require('./expenses')
const expensesDetailRouter = require('./expensesDetail')
const operationLogRouter = require('./operationLog')
const jwtAuth = require('../util/user-jwt')
const router = express.Router()

router.use(jwtAuth) // 注入jwt认证中间件

router.use('/api', userRouter) // 注入用户路由模块
router.use('/api', loginRouter) // 注入登录路由模块
router.use('/api', expensesRouter) // 注入花销路由模块
router.use('/api', expensesDetailRouter) // 注入花销app详情路由模块
router.use('/api', operationLogRouter) // 注入操作日志路由模块

// 自定义统一异常处理中间件，需要放在代码最后
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 自定义用户认证失败的错误返回
  if (err && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err
    // 抛出401异常
    res.status(status).json({
      code: status,
      message: message || 'token失效，请重新登录',
      data: null
    })
  } else {
    const { output } = err || {}
    // 错误码和错误信息
    const errCode = (output && output.statusCode) || 500
    const errMsg = (output && output.payload && output.payload.error) || err.message
    res.status(errCode).json({
      code: errCode,
      message: errMsg
    })
  }
})

module.exports = router
