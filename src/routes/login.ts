/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-16 11:09:47
 * @FilePath: \wanWan\routes\login.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
import loginController from '../controllers/loginController' // 登录控制器
import { loginParams, registerParams } from '../middleware/login'
const router = express.Router() //模块化路由

router.post('/signUp', [registerParams], loginController.register) //注册

router.post('/signIn', [loginParams], loginController.login)

export default router
