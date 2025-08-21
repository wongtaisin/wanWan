/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:22
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-21 17:08:01
 * @FilePath: \express\controllers\expensesController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
const expensesService = require('../service/expensesService')

// 添加花销
exports.add = async (req: any, res: any, next: any) => {
  let { eat, drink, play, glad, tolls, oil, parking, supermarket, online_shopping } = req.body

  const params: any = [eat, drink, play, glad, tolls, oil, parking, supermarket, online_shopping]

  let result = await mysql.query(expensesService.addExpenses, params)
  if (result) {
    res.json({
      msg: '添加成功',
      data: result,
      code: 200
    })
  }
}

// 获取花销列表
exports.list = async (req: any, res: any) => {
  try {
    // 执行查询获取花销列表
    const data = await mysql.query(expensesService.expensesAll)
    res.json({ data })
  } catch (error) {
    // 捕获并处理查询过程中的错误
    console.error('获取花销列表失败:', error)
    res.status(500).json({
      msg: '获取花销列表失败',
      code: 500
    })
  }
}
