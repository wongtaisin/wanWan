/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-23 15:32:18
 * @FilePath: \express\controllers\loginController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
const loginService = require('../service/loginService')

// 注册用户
exports.register = async (req: any, res: any) => {
  try {
    const { username, password, phone, age, sex } = req.body
    if (!username || !password || !phone) {
      return res.status(400).json({ message: '用户名、密码和手机号都是必填项' })
    }

    // 查询用户是否已存在
    const checkUser: any = await mysql.query(loginService.checkUser, [username, phone] as never[])

    if (checkUser.length > 0) {
      return res.status(400).json({ message: '用户名或手机号已存在' })
    }

    // 插入新用户
    const result: any = await mysql.query(loginService.addUser, [
      username,
      password,
      phone,
      age,
      sex
    ] as never[])

    res.status(201).json({
      message: '注册成功',
      userId: result.insertId,
      username,
      phone,
      age,
      sex
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({ message: '注册失败，请稍后重试' })
  }
}

const jwt = require('jsonwebtoken')
// 登录
exports.login = async (req: any, res: any) => {
  let { username } = req.body

  // 登录成功，签发一个token并返回给前端
  const token = jwt.sign(
    // payload：签发的 token 里面要包含的一些数据
    { username },
    // 私钥
    'caowj',
    // 设置过期时间
    { expiresIn: 60 * 60 * 24 } //1 day
  )

  res.json({
    msg: '登录成功',
    data: { token }
  })
}
