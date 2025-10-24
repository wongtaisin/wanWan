/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:52:43
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-22 15:49:40
 * @FilePath: \admin\routes\expenses.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
import _middleware from '../middleware/shop'
const shopController = require('../controllers/shopController')
const router = express.Router() //模块化路由

// 添加商店
router.post('/shop/add', [_middleware.verifyShop], shopController.add)

module.exports = router
