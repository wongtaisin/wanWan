/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-22 16:30:33
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-23 08:32:31
 * @FilePath: \admin\util\expenses.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'
import _util from '../util/util'
const expensesService = require('../service/expensesService')

// 执行查询获取花销列表
const list = (userId: number, params: never[]): Promise<unknown> => {
  return new Promise<void>(async (resolve, reject): Promise<void> => {
    try {
      const data: any = await mysql.query(expensesService.expensesById(userId), params)

      data.forEach((item: any) => {
        item.create_date = _util.formatDate(item.create_date, 'yyyy-MM-dd')
      })
      resolve(data)
    } catch (error) {
      console.error('格式化日期失败:', error)
      reject(error)
    }
  })
}

// 判断是否存在的字段
const judgeName = (fieldName: string) => {
  const allowedFields = [
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
    'vip'
  ]
  if (!allowedFields.includes(fieldName)) {
    throw new Error('字段名称无效')
  }

  return true
}

export default { list, judgeName }
