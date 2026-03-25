/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-22 16:30:33
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-13 15:53:54
 * @FilePath: \wanWan\util\expenses.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../config/mysql'
import expensesService from '../service/expensesService'

/**
 * @desc 获取花销列表，可根据 userId，时间 查询，不传则查询所有的花销
 * @param {object} row {userId, startDate, endDate}
 * @param {never[]} params 查询参数 [userId, startDate, endDate]
 * @return {Promise<unknown>} 花销列表
 */
const list = (
  row: {
    userId?: number // 用户ID
    startDate?: string // 开始日期
    endDate?: string // 结束日期
  },
  params: never[]
): Promise<unknown> => {
  return new Promise<void>(async (resolve, reject): Promise<void> => {
    try {
      const data: any = await mysql.query(expensesService.filterUserIdAndDate(row), params)

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
    'vip',
    'other'
  ]
  if (!allowedFields.includes(fieldName)) {
    throw new Error('字段名称无效')
  }

  return true
}

export default { list, judgeName }
