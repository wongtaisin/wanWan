/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:52:43
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-13 10:40:11
 * @FilePath: \wanWan\routes\shop.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
import shopController from '../controllers/shopController'
import { verifyShop } from '../middleware/shop'
const router = express.Router() //模块化路由

// 添加商店
router.post('/shop/add', [verifyShop], shopController.add)

router.post('/shop/edit', shopController.edit)

router.get('/shop/all', shopController.all)

router.post('/shop/list', shopController.list)

router.delete('/shop/delete/:id', shopController.delete)

module.exports = router
