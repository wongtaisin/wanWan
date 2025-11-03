/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:22
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-03 16:12:01
 * @FilePath: \wanWan\controllers\expensesController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
import _expenses from '../util/expenses'
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
      message: '数据已合并更新'
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
    message: '添加成功'
  })
}

// 获取花销列表
exports.list = async (req: any, res: any) => {
  const { startDate, endDate } = req.body
  const userId = req.body.userId ?? req.auth.user_id

  const params = userId ? [userId, startDate, endDate] : [startDate, endDate]

  try {
    const result: any = await _expenses.list(userId, params as never[])

    res.json({
      code: 200,
      data: {
        list: result,
        total: result.length,
        startDate,
        endDate
      },
      message: '获取花销列表成功'
    })
  } catch (error) {
    console.error('获取花销列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取花销列表失败'
    })
  }
}

// 获取合计花销
exports.total = async (req: any, res: any) => {
  const { startDate, endDate } = req.query // get 请求参数
  const userId = req.query.userId ?? req.auth.user_id

  const params = [userId, startDate, endDate] as never[]

  try {
    const data: any = await _expenses.list(userId, params)

    const filteredData = data.filter((item: any) => item.user_id === userId)

    const result = {} as any

    filteredData.forEach((item: any) => {
      Object.entries(item).forEach(([key, value]) => {
        if (['id', 'user_id', 'create_date'].includes(key)) return // 跳过不需要的字段
        if (value && value !== '') {
          String(value)
            .split(',')
            .forEach(v => {
              const num = Number(v)
              if (!isNaN(num)) {
                result[key] = (result[key] || 0) + num
              }
            })
        }
      })
    })

    const total = Object.entries(result).reduce((acc, [key, value]) => {
      return acc + Number(value)
    }, 0)

    res.json({
      code: 200,
      data: {
        expenses: { ...result },
        total: total.toFixed(2),
        startDate,
        endDate
      },
      message: '获取花销合计成功'
    })
  } catch (error) {
    console.error('获取花销列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取花销列表失败'
    })
  }
}

exports.checkFieldTotal = async (req: any, res: any) => {
  let { name, startDate, endDate } = req.body

  const params = [req.auth.user_id, startDate, endDate] as never[]

  const queryPromises = expensesService.getFieldValues(name)

  const data: any = await Promise.all(queryPromises.map((query: any) => mysql.query(query, params)))

  const result = {} as any

  // 定义需要跳过的字段
  const SKIP_FIELDS = ['id', 'user_id', 'create_date']

  // 使用 flatMap 将 data 展平为一维数组
  const flatRecords = data.flatMap((fieldArray: any) => fieldArray)

  flatRecords.forEach((record: any) => {
    Object.entries(record).forEach(([key, value]: any) => {
      if (SKIP_FIELDS.includes(key)) return
      if (!result[key]) result[key] = '' // 初始化空字符串
      result[key] += (result[key] ? ',' : '') + value // 累加值
    })
  })

  // flatRecords.forEach((record: any) => {
  //   for (const [key, value] of Object.entries(record)) {
  //     if (SKIP_FIELDS.includes(key)) continue
  //     result[key] = result[key] ? `${result[key]},${value}` : String(value) // 初始化或累加值
  //   }
  // })

  const sum = {} as any
  Object.entries(result).forEach(([key, value]: any) => {
    // 将每个值转为数字并累加，保留两位小数
    sum[key] = String(value)
      .split(',')
      .map(Number)
      .filter(num => !isNaN(num))
      .reduce((total: number, num: number) => total + num, 0)
    // .toFixed(2)
  })

  // 计算所有字段的总合计
  const grandTotal = Object.values(sum)
    .map(Number)
    .reduce((acc, value) => {
      return acc + Number(value)
    }, 0)
  // .toFixed(2)

  res.json({
    code: 200,
    data: {
      expenses: { ...result },
      sum: { ...sum },
      total: grandTotal,
      startDate,
      endDate
    },
    message: '查询成功'
  })
}

exports.delete = async (req: any, res: any) => {
  let { records } = req.body

  try {
    // 获取要执行的 SQL 查询数组
    const data = expensesService.batchDeleteExpenses(records)

    // 使用 Promise.all 确保所有 SQL 查询都执行完成
    const results = await Promise.all(
      data.sql.map((item: any, i: number) => mysql.query(item, data.params[i]))
    )

    // 计算总共影响的行数
    const affectedRows = results.reduce((total: number, result: any) => {
      return total + (result.affectedRows || 0)
    }, 0)

    res.json({
      code: 200,
      data: {
        affectedRows: affectedRows,
        queries: data.sql.length
      },
      message: '批量删除成功'
    })
  } catch (error) {
    console.error('批量删除失败:', error)
    res.status(500).json({
      code: 500,
      message: '批量删除失败'
    })
  }
}
