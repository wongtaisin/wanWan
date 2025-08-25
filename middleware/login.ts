/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-25 11:02:53
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-25 11:08:44
 * @FilePath: \express\middleware\login.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
const loginService = require('../service/loginService')
import mysql from '../db/mysql'

// 登录参数校验账号密码中间件
const login_params = async (req: any, res: any, next: any) => {
  // 从请求体中获取用户名和密码
  let { username, password } = req.body
  console.log(username, password)

  // 检查用户名和密码是否为空
  if (!username || !password) {
    return res.status(400).json({
      message: '账号和密码不能为空'
    })
  }

  try {
    // 查询数据库，验证账号密码
    const user = (await mysql.query(loginService.verifyUser, [
      username,
      password
    ] as never[])) as any

    if (user.length === 0) {
      return res.status(401).json({
        message: '账号或密码不正确'
      })
    }

    // 验证通过，将用户信息添加到请求对象中
    req.user = user[0]
    next()
  } catch (error) {
    console.error('验证失败:', error)
    res.status(500).json({
      message: '服务器错误，请稍后重试'
    })
  }
}

export default { login_params }
