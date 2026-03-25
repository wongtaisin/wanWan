/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-25 11:02:53
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-31 15:21:27
 * @FilePath: \wanWan\src\middleware\login.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../config/mysql'
import loginService from '../service/loginService'
import { hashPassword, verifyPassword } from '../util/cryptoJS'
import _util from '../util/util'

/**
 * @desc 登录参数校验账号密码
 * @param {string} user_name - 用户名
 * @param {string} password - 密码
 * @returns {void}
 * @throws {Error} 账号和密码不能为空
 * @throws {Error} 账号或密码不正确
 */
export const loginParams = async (req: any, res: any, next: any) => {
  // 从请求体中获取用户名和密码
  let { user_name, password } = req.body

  // 检查用户名和密码是否为空
  if (!user_name || !password) {
    return res.status(400).json({
      code: 400,
      message: '账号和密码不能为空'
    })
  }

  try {
    const resultUser = (await mysql.query(loginService.checkUser, [user_name] as never[])) as any

    const { password: hash, salt } = resultUser[0]

    const isPasswordValid = verifyPassword(password, hash, salt)

    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '账号或密码不正确'
      })
    }

    // 查询数据库，验证账号密码
    // const result = (await mysql.query(loginService.verifyUser, [user_name, hash] as never[])) as any

    // if (result.length === 0) {
    //   return res.status(401).json({
    //     code: 401,
    //     message: '账号或密码不正确'
    //   })
    // }

    // 根据用户ID更新登录时间，并且获取 login_ip
    await mysql.query(loginService.updateLoginTimeAndGetIp, [
      _util.getClientIp(req),
      resultUser[0].user_id
    ] as never[])

    // 验证通过，将用户信息添加到请求对象中
    req.user = resultUser[0]
    next()
  } catch (error) {
    console.error('验证失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误，请稍后重试'
    })
  }
}

/**
 * @desc 注册参数校验用户名、手机号、密码
 * @param {string} userName - 用户名
 * @param {string} password - 密码
 * @param {string} phone - 手机号
 * @param {number} age - 年龄
 * @param {string} sex - 性别
 * @returns {void}
 * @throws {Error} 用户名、密码和手机号都是必填项
 * @throws {Error} 手机号码格式如:138xxxx8754
 * @throws {Error} 用户名或手机号已存在
 */
export const registerParams = async (req: any, res: any, next: any) => {
  try {
    const { userName, password, phone, age, sex } = req.body
    if (!userName || !password || !phone) {
      return res.status(400).json({
        code: 400,
        message: '用户名、密码和手机号都是必填项'
      })
    }

    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(String(phone))) {
      return res.status(400).json({
        code: 400,
        message: '手机号码格式如:138xxxx8754'
      })
    }

    // 查询用户是否已存在
    const resultPhone: any = await mysql.query(loginService.checkUserAndPhone, [
      userName,
      phone
    ] as never[])

    if (resultPhone.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '用户名或手机号已存在'
      })
    }

    const { hash, salt } = hashPassword(password) // 密码加密

    const result: any = await mysql.query(loginService.addUser, [
      userName,
      phone,
      age,
      sex,
      hash, // password 加密后存储的哈希值
      salt // 加密后存储的盐值
    ] as never[])

    // 验证通过，将用户信息添加到请求对象中
    req.userInfo = {
      userId: result.insertId,
      userName,
      phone,
      age,
      sex
    }

    next()
  } catch (error) {
    console.error('验证失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误，请稍后重试'
    })
  }
}
