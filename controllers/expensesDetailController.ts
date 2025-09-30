/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 09:55:43
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-30 16:09:26
 * @FilePath: \wanWan\controllers\expensesDetailController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
import { valuesResult } from '../util/expensesDetail'
import _util from '../util/util'
const expensesDetailService = require('../service/expensesDetailService')
const expensesService = require('../service/expensesService')

exports.list = async (req: any, res: any, next: any) => {
  const { userId, expensesName, startDate, endDate } = req.query

  const result: any = await mysql.query(
    expensesDetailService.buildQueryExpensesDetail({
      userId,
      expensesName,
      startDate,
      endDate
    }),
    [userId, expensesName, startDate, endDate] as never[]
  )

  res.json({
    code: 200,
    data: result,
    msg: '查询成功'
  })
}

// 添加花销
exports.add = async (req: any, res: any, next: any) => {
  let { expenses_name, money, remark, create_date } = req.body

  let { user_id, user_name } = req.auth

  const createDate = !create_date
    ? _util.formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss')
    : create_date

  // 检查该字段时间段是否已存在
  const checkResult: any = await mysql.query(
    expensesDetailService.checkTimeByFieldNameExpensesDetail(),
    [user_id, createDate, expenses_name] as never[]
  )

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
      user_name,
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

  const params = [user_id, user_name, expenses_name, money, remark, create_date] as never[]
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

/**
 * @description: 更新花销
 * @param {number} id // 必填
 * @param {string} expenses_name // 名称 必填
 * @param {string} money // 金额
 * @param {string} remark // 备注
 */
exports.upDate = async (req: any, res: any, next: any) => {
  let { id, expenses_name, money, remark } = req.body

  // 先获取id的 info
  const getInfo: any = await mysql.query(expensesDetailService.getIdExpensesDetail, [id] as never[])

  const createDate = _util.formatDate(getInfo[0].create_date, 'yyyy-MM-dd hh:mm:ss')

  const createName = getInfo[0].expenses_name

  // 更新 expensesDetail 表的字段值，需要先更新 expensesDetail 表的字段值，再更新 expenses 表的字段值
  const params = [expenses_name, money, remark, id] as never[]
  const result = await mysql.query(expensesDetailService.updateExpensesDetail, params)

  // 更改 expenses_name 的值，需要把 expenses[createName] 的值一并改变
  if (createName !== expenses_name && !!expenses_name) {
    // 先删除旧的字段值
    const abc = await valuesResult(req.auth.user_id, createDate, createName)
    await mysql.query(expensesService.updateExpensesDate(createName), [
      abc,
      req.auth.user_id,
      createDate
    ] as never[])
  }

  // 获取 expenses_name 新的字段值
  const data = await valuesResult(req.auth.user_id, createDate, expenses_name, money)

  // 更新 expenses 表的字段值
  await mysql.query(expensesService.updateExpensesDate(expenses_name), [
    data,
    req.auth.user_id,
    createDate
  ] as never[])

  res.json({
    code: 200,
    data: {
      id,
      userId: req.auth.user_id,
      [expenses_name]: money,
      remark,
      updateDate: _util.formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss')
    },
    msg: '更新成功'
  })
}

exports.delete = async (req: any, res: any, next: any) => {
  const { id }: { id: number } = req.params

  const { user_id } = req.auth

  const getInfo: any = await mysql.query(expensesDetailService.getIdExpensesDetail, [id] as never[])

  if (getInfo.length < 1) {
    return res.json({
      code: 400,
      msg: '没有数据'
    })
  }

  const { create_date, expenses_name } = getInfo[0]

  // 先删除 deleteExpenses 的 id 数据
  await mysql.query(expensesDetailService.deleteExpensesDetail, [id] as never[])

  const result = await valuesResult(user_id, create_date, expenses_name)

  await mysql.query(expensesService.updateExpensesDate(expenses_name), [
    result,
    user_id,
    create_date
  ] as never[])

  // 查询 expenses 当前日期的值
  const checkResult: any = await mysql.query(expensesService.checkDate, [
    _util.formatDate(create_date, 'yyyy-MM-dd')
  ] as never[])

  const excludeKeys = ['id', 'user_id', 'user_name', 'create_date'] // 不查询的字段
  const othersFalsyCheck = checkResult.map((item: any) => {
    const keys = Object.keys(item).filter((k: string) => !excludeKeys.includes(k))
    const allOthersFalsy = keys.every(
      (k: string) => item[k] === null || item[k] === undefined || item[k] === ''
    )
    return allOthersFalsy
  })
  const isBoolean = othersFalsyCheck.some((value: boolean) => value === true)

  // 查询 expenses 是否有其他值，有则不删除，isBoolean = true 没其他值，进入删除
  if (isBoolean) {
    await mysql.query(expensesService.deleteExpensesByUserIdAndDate, [
      user_id,
      _util.formatDate(create_date, 'yyyy-MM-dd')
    ] as never[])
  }

  res.json({
    code: 200,
    msg: '删除成功'
  })
}

/**
 * @description: 修复数据，将 expensesDetail 表中与 expenses 表不一致的数据修复
 *
 * 1. 先查询 expensesDetail 表中与 expenses 表不一致的数据
 * 2. 返回不一样的数据，根据 user_id 和 create_date 分组，合并数据
 * [{
    user_id,
    user_name,
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
    red_packet,
    vip,
    create_date,
 * }]
 * 3. 合并数据后，根据 user_id 和 create_date 更新 expenses 表
 */
exports.repairExpensesData = async (req: any, res: any, next: any) => {
  const contrastList: any = await mysql.query(expensesDetailService.contrastDate)

  if (contrastList.length < 1) {
    return res.json({
      code: 200,
      msg: 'expenses 数据库完整'
    })
  }

  // console.log(`1111`, contrastList)

  const fields = [
    'user_id',
    'user_name',
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
    'red_packet',
    'vip',
    'create_date'
  ]

  // 按 user_id 和 DATE(create_date) 分组并合并数据
  const mergedDataMap = contrastList.reduce((acc: Map<string, any>, item: any) => {
    // 使用 user_id 和 DATE(create_date) 组合作为唯一键，区分相同 user_id 但不同日期的记录
    const uniqueKey = `${item.user_id}_${_util.formatDate(item.create_date, 'yyyy-MM-dd')}`

    // 如果这个唯一键还没有记录，创建一个新记录
    if (!acc.has(uniqueKey)) {
      acc.set(uniqueKey, {
        user_id: item.user_id,
        user_name: item.user_name,
        create_date: item.create_date
      })
    }

    // 获取当前用户在当前日期的记录
    const userRecord = acc.get(uniqueKey)

    // 将 expenses_name 作为参数，money 作为对应的值
    if (item.expenses_name && fields.includes(item.expenses_name)) {
      // 如果该字段已经有值，则追加新值，否则创建新值
      userRecord[item.expenses_name] = userRecord[item.expenses_name]
        ? `${userRecord[item.expenses_name]},${item.money}`
        : item.money
    }

    return acc
  }, new Map())

  // 将Map转换为数组
  const mergedData = Array.from(mergedDataMap.values())

  // console.log(`22222`, mergedData)

  // 确保所有字段都存在，没有的设为null
  const params = mergedData.map((item: any) => {
    fields.forEach(field => {
      if (!item[field]) {
        item[field] = null
      }
    })
    // 只返回fields中定义的字段的值，形成一个值数组
    return fields.map(field => item[field])
  })

  // console.log(`3333`, params)

  // 批量插入数据
  await Promise.all(
    params.map(async (item: any) => {
      return mysql.query(expensesService.addExpenses, item as never[])
    })
  )

  res.json({
    code: 200,
    data: mergedData,
    msg: '对比成功'
  })
}
