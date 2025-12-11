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
import jwtAuth from '../util/user-jwt'
import commonRouter from './common' // 通用路由模块
import expensesRouter from './expenses' // 花销路由模块
import expensesDetailRouter from './expensesDetail' // 消费明细详情路由模块
import loginRouter from './login' // 登录路由模块
import operationLogRouter from './operationLog' // 操作日志路由模块
import shopRouter from './shop' // 店铺路由模块
import userRouter from './user' // 用户路由模块

const router = express.Router()

router.use(jwtAuth) // 注入jwt认证中间件

const routerList = [
  commonRouter,
  userRouter,
  loginRouter,
  expensesRouter,
  expensesDetailRouter,
  shopRouter,
  operationLogRouter
]

routerList.forEach(item => {
  router.use('/api', item)
})

// 自定义统一异常处理中间件，需要放在代码最后
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 自定义用户认证失败的错误返回
  if (err && err.name === 'UnauthorizedError') {
    const { status = 401, message } = err
    // 抛出401异常
    res.status(status).json({
      code: status,
      message: `${message}，token失效，请重新登录`
    })
  } else {
    const { output } = err || {}
    // 错误码和错误信息
    const errCode = output?.statusCode || 500
    const errMsg = output?.payload?.error || err.message
    res.status(errCode).json({
      code: errCode,
      message: errMsg
    })
  }
})

export default router
