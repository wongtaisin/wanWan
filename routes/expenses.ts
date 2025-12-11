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
import expensesController from '../controllers/expensesController'
import { updateThenAddIfOk } from '../middleware/expenses'
const router = express.Router() //模块化路由

// 添加花销
router.post('/expenses/add', [updateThenAddIfOk], expensesController.add)

// 查看花销
router.post('/expenses/list', expensesController.list)

// 查询指定字段的值，支持用户ID和可选的日期范围
router.post('/expenses/check', expensesController.checkFieldTotal)

router.post('/expenses/del', expensesController.delete)

router.get('/expenses/total', expensesController.total)

export default router
