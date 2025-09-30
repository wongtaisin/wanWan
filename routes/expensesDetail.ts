/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 10:01:50
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-29 13:53:38
 * @FilePath: \admin\routes\expensesDetail.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
const controller = require('../controllers/expensesDetailController')
const router = express.Router() //模块化路由

// 查询所有
router.get('/expensesDetail/list', controller.list)

// 添加花销
router.post('/expensesDetail/add', controller.add)

router.post('/expensesDetail/edit', controller.upDate)

router.delete('/expensesDetail/del/:id', controller.delete)

router.get('/expensesDetail/repairData', controller.repairExpensesData)

module.exports = router
