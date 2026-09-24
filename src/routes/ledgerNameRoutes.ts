/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-09-25 01:43:34
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-25 01:56:46
 * @FilePath: \wanWan\src\routes\ledgerNameRoutes.ts
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
import ledgerNameController from '../controllers/ledgerNameController'
const router = express.Router() //模块化路由

// 查询所有账单名称
router.get('/checkType', ledgerNameController.checkType)

export default router
