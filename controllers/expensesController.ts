/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:22
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-17 08:26:40
 * @FilePath: \wanWan\controllers\expensesController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
import _expenses from '../util/expenses'
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
  const { userId, startDate, endDate } = req.body

  const params = [userId, startDate, endDate].filter(item => item !== undefined)

  try {
    const result: any = await _expenses.list({ userId, startDate, endDate }, params as never[])

    const totalResult = result.map((item: any) => {
      let total = 0
      Object.entries(item).forEach(([key, value]: any) => {
        if (['id', 'user_id', 'user_name', 'create_date'].includes(key)) return
        if (!!value) {
          const sum = String(value)
            .split(',')
            .map(v => Number(v))
            .filter(n => !isNaN(n))
            .reduce((acc, n) => acc + n, 0)
          total += sum
        }
      })
      return { info: _util.formatNumber(total), date: item.create_date }
    })

    res.json({
      code: 200,
      data: {
        list: result,
        total: result.length,
        sum: totalResult,
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

  const userId = req.query.userId ?? req.auth.user_id // TODO: 需要修改成可不传 userId 参数

  const params = [userId, startDate, endDate].filter(item => item !== undefined) // 过滤掉 undefined 参数

  try {
    const result: any = await _expenses.list({ userId, startDate, endDate }, params as never[])

    const filteredData = result.filter((item: any) => Number(item.user_id) === Number(userId)) // 这里做一次过滤，确保 user_id 一致

    const listData = userId ? filteredData : result // 如果没有 userId，则使用全部数据

    const expenses: Record<string, number> = {} // 用于存储各字段的合计值

    listData.forEach((item: any) => {
      Object.entries(item).forEach(([key, value]: any) => {
        if (['id', 'user_id', 'user_name', 'create_date'].includes(key)) return // 跳过不需要的字段
        if (!!value) {
          // 将可能的逗号分隔值解析为数字并求和，然后累加到 expenses[key]
          const sum = String(value) // 转换为字符串
            .split(',') // 分割成数组
            .map(v => Number(v)) // 转换为数字
            .filter(n => !isNaN(n)) // 过滤非数字
            .reduce((acc, n) => acc + n, 0) // 求和

          expenses[key] = (expenses[key] || 0) + sum // 累加到总和
        }
      })
    })

    const grandTotal = Object.values(expenses).reduce((acc: number, value) => acc + value, 0) // 累加所有值

    res.json({
      code: 200,
      data: {
        userId,
        expenses,
        total: _util.formatNumber(grandTotal),
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

  const userId = req.body.userId ?? req.auth.user_id // TODO: 需要修改成可不传 userId 参数

  const params = [userId, startDate, endDate] as never[]

  const queryPromises = expensesService.getFieldValues(name)

  const data: any = await Promise.all(queryPromises.map((query: any) => mysql.query(query, params)))

  const result = {} as any

  // 定义需要跳过的字段
  const SKIP_FIELDS = ['id', 'user_id', 'user_name', 'create_date']

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
    const acc = String(value)
      .split(',') // 分割成数组
      .map(Number) // 转为数字
      .filter(n => !isNaN(n)) // 过滤非数字
      .reduce((total: number, num: number) => total + num, 0) // 累加

    sum[key] = _util.formatNumber(acc)
  })

  // 计算所有字段的总合计
  const grandTotal = Object.values(sum)
    .map(Number)
    .reduce((acc, value) => {
      return acc + Number(value)
    }, 0)

  res.json({
    code: 200,
    data: {
      expenses: { ...result },
      sum: { ...sum },
      total: _util.formatNumber(grandTotal),
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
