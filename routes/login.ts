/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-25 11:36:25
 * @FilePath: \express\routes\login.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
import _middleware from '../middleware/login'
const loginController = require('../controllers/loginController') // 登录控制器
const router = express.Router() //模块化路由

router.post('/register', loginController.register) //注册

router.post('/login', [_middleware.login_params], loginController.login)

module.exports = router
