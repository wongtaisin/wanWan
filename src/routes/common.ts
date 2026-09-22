/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-08 16:22:20
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-23 00:14:03
 * @FilePath: \wanWan\src\routes\common.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' //
import commonController from '../controllers/commonController'
import _upload from '../util/upload'
const router = express.Router() //模块化路由

// 上传文件
router.post('/upload', _upload, commonController.uploadFile)

// 地区数据接口 - 添加跳过日志记录
router.get('/areaData', commonController.getAreaData)

router.post('/list', commonController.commitList)

export default router
