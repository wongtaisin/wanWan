/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-11 08:22:31
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-16 11:10:11
 * @FilePath: \wanWan\routes\user.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
import userController from '../controllers/userController'
const router = express.Router()

router.delete('/delete/:id', userController.deleteUser)

router.get('/list', userController.getUser)

router.get('/userInfo', userController.getUserInfo)

export default router
