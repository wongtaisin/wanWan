/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 09:55:43
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-23 14:16:45
 * @FilePath: \admin\controllers\expensesDetailController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
const expensesDetailService = require('../service/expensesDetailService')
const expensesService = require('../service/expensesService')

// 添加花销
exports.add = async (req: any, res: any, next: any) => {
  console.log('create_date', req.body, req.auth)

  let { expenses_name, money, create_date } = req.body

  let { user_id, user_name } = req.auth

  if (create_date !== '') {
    const checkResult: any = await mysql.query(expensesDetailService.checkDate, [
      user_id,
      create_date
    ] as never[])

    if (checkResult.length > 0) {
      return res.json({
        code: 400,
        msg: '该日期已存在'
      })
    }
  }

  const params = [user_id, user_name, expenses_name, money, create_date] as never[]

  const result: any = await mysql.query(expensesDetailService.add, params)

  res.json({
    code: 200,
    data: {
      id: result.insertId,
      userId: req.auth.user_id,
      date: create_date
    },

    msg: '添加成功'
  })
}
