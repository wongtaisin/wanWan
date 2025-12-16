/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 10:01:50
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-16 11:09:30
 * @FilePath: \wanWan\routes\expensesDetail.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import express from 'express' // 引入express模块
import expensesDetailController from '../controllers/expensesDetailController'
const router = express.Router() //模块化路由

// 查询所有
router.post('/list', expensesDetailController.list)

// 添加花销
router.post('/add', expensesDetailController.add)

router.post('/edit', expensesDetailController.upDate)

router.delete('/del/:id', expensesDetailController.delete)

router.get('/repairData', expensesDetailController.repairExpensesData)

router.get('/checkDatePrice', expensesDetailController.checkDatePrice)

export default router
