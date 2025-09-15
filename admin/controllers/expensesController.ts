/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:22
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-15 10:54:10
 * @FilePath: \admin\controllers\expensesController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
import _util from '../util/util'
const expensesService = require('../service/expensesService')

// 添加花销
exports.add = async (req: any, res: any, next: any) => {
  let { create_date } = req.body
  const createDate = create_date || new Date().toISOString().split('T')[0]
  // 日期已存在，执行更新合并操作
  if (!!req.updateParams) {
    await mysql.query(expensesService.updateExpenses, req.updateParams)

    return res.json({
      code: 200,
      data: {
        userId: req.auth.user_id,
        id: req.updateParams[req.updateParams.length - 1],
        date: createDate
      },
      msg: '数据已合并更新'
    })
  }

  const result: any = await mysql.query(expensesService.addExpenses, req.addParams)

  res.json({
    code: 200,
    data: {
      id: result.insertId,
      userId: req.auth.user_id,
      date: createDate
    },
    msg: '添加成功'
  })
}

// 获取花销列表
exports.list = async (req: any, res: any) => {
  try {
    // 执行查询获取花销列表
    const data: any = await mysql.query(expensesService.expensesAll)
    data.forEach((item: any) => {
      item.create_date = _util.formatDate(item.create_date, 'yyyy-MM-dd')
    })
    res.json({
      code: 200,
      data: data,
      msg: '获取花销列表成功'
    })
  } catch (error) {
    // 捕获并处理查询过程中的错误
    console.error('获取花销列表失败:', error)
    res.status(500).json({
      msg: '获取花销列表失败',
      code: 500
    })
  }
}

exports.checkFieldTotal = async (req: any, res: any) => {
  let { name, startTime, endTime } = req.body

  const params = [req.auth.user_id, startTime, startTime, endTime, endTime] as never[]

  const data: any = await mysql.query(
    expensesService.getFieldValuesByUserIdAndDateRange(name),
    params
  )

  const result = [] as any

  data.forEach((item: any) => {
    result.push(...item[name].split(','))
  })

  const sum = result
    .filter((item: any) => item.trim() !== '') // 移除空字符串
    .map(Number) // 转为数字类型
    .reduce((total: number, num: number) => total + num, 0) // 累加
    .toFixed(2)

  res.json({
    code: 200,
    data: sum,
    msg: '查询成功'
  })
}
