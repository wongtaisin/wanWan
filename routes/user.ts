/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-11 08:22:31
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-03 15:07:30
 * @FilePath: \wanWan\routes\user.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
import userController from '../controllers/userController'
const upload = require('../util/upload')
const router = express.Router()

router.delete('/user/delete/:id', userController.deleteUser)

router.post('/upload', upload, (req: any, res: any, next: any) => {
  // 存储后的文件信息在 req.file 中，此时文件已经存储到本地了。
  console.log(req.file)
  res.send('success')
})

router.get('/user/list', userController.getUser)

router.get('/user/userInfo', userController.getUserInfo)

module.exports = router
