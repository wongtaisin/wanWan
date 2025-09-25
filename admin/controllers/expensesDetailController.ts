/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 09:55:43
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-25 10:00:55
 * @FilePath: \admin\controllers\expensesDetailController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
import _util from '../util/util'
const expensesDetailService = require('../service/expensesDetailService')
const expensesService = require('../service/expensesService')

// 添加花销
exports.add = async (req: any, res: any, next: any) => {
  let { expenses_name, money, create_date } = req.body

  let { user_id, user_name } = req.auth

  const createDate = !create_date
    ? _util.formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss')
    : create_date

  // 检查该字段时间段是否已存在
  const checkResult: any = await mysql.query(expensesDetailService.checkDateByUserIdAndName, [
    user_id,
    createDate,
    expenses_name
  ] as never[])

  if (checkResult.length > 0) {
    return res.json({
      code: 400,
      data: checkResult[0],
      msg: `该字段时间段已存在`
    })
  }

  // 查询当前日期的字段值
  const checkDate: any = await mysql.query(expensesService.checkDateByUserId, [
    _util.formatDate(createDate, 'yyyy-MM-dd'),
    user_id
  ] as never[])

  const existingRecord = checkDate[0]

  const values = !existingRecord
    ? money
    : existingRecord[expenses_name] // 数据库里已有值
    ? `${existingRecord[expenses_name]},${money}`
    : money // 添加数据

  if (!existingRecord) {
    // 新增 expenses 表的字段值
    await mysql.query(expensesService.addExpensesFieldName(expenses_name), [
      user_id,
      values,
      createDate
    ] as never[])
  } else {
    // 更新 expenses 表的字段值
    await mysql.query(expensesService.updateExpensesFieldName(expenses_name), [
      values,
      existingRecord?.id
    ] as never[])
  }

  const params = [user_id, user_name, expenses_name, money, create_date] as never[]
  const result: any = await mysql.query(expensesDetailService.add, params)

  res.json({
    code: 200,
    data: {
      id: result.insertId,
      userId: req.auth.user_id,
      [expenses_name]: money,
      createDate
    },
    msg: '添加成功'
  })
}
