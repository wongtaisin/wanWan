/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:22
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-23 14:18:02
 * @FilePath: \admin\controllers\expensesController.ts
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
    console.log('req.updateParams', req.updateParams)
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

  console.log('req.addParams', req.addParams)
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
  let { userId, startTime, endTime, total } = req.body

  const params = [userId, startTime, endTime] as never[]

  try {
    const data: any = await _expenses.list(userId, params)

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

// 获取合计花销
exports.total = async (req: any, res: any) => {
  let { userId, startTime, endTime } = req.query // get 请求参数

  let user_id = Number(userId) // 转为数字类型

  const params = [user_id, startTime, endTime] as never[]

  try {
    const data: any = await _expenses.list(user_id, params)

    const filteredData = data.filter((item: any) => item.user_id === user_id)

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
        ...result,
        total,
        startTime,
        endTime
      },
      msg: '获取花销合计成功'
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

  const params = [req.auth.user_id, startTime, endTime] as never[]

  const data: any = await mysql.query(expensesService.getFieldValues(name), params)

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
      msg: '批量删除成功'
    })
  } catch (error) {
    console.error('批量删除失败:', error)
    res.status(500).json({
      code: 500,
      msg: '批量删除失败'
    })
  }
}
