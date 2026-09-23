/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-09-24 00:43:17
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-24 02:10:45
 * @FilePath: \wanWan\src\routes\ledgerRoutes.ts
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

import express from 'express' // 引入express模块
import ledgerController from '../controllers/ledgerController'
const router = express.Router() //模块化路由

// 查询所有
router.post('/list', ledgerController.list)

// 添加花销
router.post('/add', ledgerController.add)

router.post('/edit', ledgerController.upDate)

router.delete('/del/:id', ledgerController.delete)

router.get('/checkDatePrice', ledgerController.checkDatePrice)

export default router
