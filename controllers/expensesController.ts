/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:22
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-29 15:41:06
 * @FilePath: \express\controllers\expensesController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
import _util from '../util/util'
const expensesService = require('../service/expensesService')

// 添加花销
exports.add = async (req: any, res: any, next: any) => {
  let {
    eat,
    drink,
    play,
    glad,
    tolls,
    oil,
    parking,
    traffic,
    supermarket,
    online_shopping,
    phone_bill,
    red_packet
  } = req.body

  const createDate = new Date().toISOString().split('T')[0] // 当天的年月日

  const checkDate: any = await mysql.query(expensesService.checkDate, [createDate] as never[])

  // 日期已存在，执行更新合并操作
  if (checkDate.length > 0) {
    // return res.status(400).json({ message: '日期已存在' })
    const existingRecord = checkDate[0]
    const fields = [
      'eat',
      'drink',
      'play',
      'glad',
      'tolls',
      'oil',
      'parking',
      'traffic',
      'supermarket',
      'online_shopping',
      'phone_bill',
      'red_packet'
    ]

    const updateParams: any = fields
      .map(field =>
        existingRecord[field] ? `${existingRecord[field]},${req.body[field]}` : req.body[field]
      )
      .concat(existingRecord.id)

    let result = await mysql.query(expensesService.updateExpenses, updateParams)

    if (result) {
      return res.json({
        msg: '数据已合并更新',
        code: 200
      })
    }
  }

  const params: any = [
    eat,
    drink,
    play,
    glad,
    tolls,
    oil,
    parking,
    traffic,
    supermarket,
    online_shopping,
    phone_bill,
    red_packet
  ]

  let result = await mysql.query(expensesService.addExpenses, params)
  if (result) {
    res.json({
      msg: '添加成功',
      data: {
        ...result
      },
      code: 200
    })
  }
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
