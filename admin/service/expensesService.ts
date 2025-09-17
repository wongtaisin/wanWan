/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:48
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-17 08:44:33
 * @FilePath: \admin\service\expensesService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

// 查询所有
export const expensesAll = `SELECT * FROM expenses`

// 根据 userId，时间，查询，都可传可不传
export const expensesById = (userId?: number) => {
  const id = userId ? `user_id = ?` : `1=1`
  const date = `AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date)) AND IFNULL(?, DATE(create_date))`

  return `SELECT * FROM expenses WHERE ${id} ${date}`
}

// 添加
export const addExpenses = `INSERT INTO expenses (user_id, eat, drink, play, glad, tolls, oil, parking, traffic, supermarket, online_shopping, phone_bill, red_packet, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`

// 根据 id 更新
export const updateExpenses = `UPDATE expenses SET eat = ?, drink = ?, play = ?, glad = ?, tolls = ?, oil = ?, parking = ?, traffic = ?, supermarket = ?, online_shopping = ?, phone_bill = ?, red_packet = ? WHERE id = ?`

// 根据 id 删除
export const deleteExpenses = `DELETE FROM expenses WHERE id = ?`

export const deleteExpensesAll = `DELETE FROM expenses`

// 检查日期是否存在
export const checkDate = `SELECT * FROM expenses WHERE DATE(create_date) = ?` // DATE(create_date) 是将 create_date 转换为日期格式，然后再进行比较

export const checkDateByUserId = `SELECT * FROM expenses WHERE DATE(create_date) = ? AND user_id = ?` // DATE(create_date) 是将 create_date 转换为日期格式，然后再进行比较，同时对比 user_id 是否相同

// 查询指定字段的值，支持用户ID和可选的日期范围（不限制日期，可传可不传）
export const getFieldValuesByUserIdAndDateRange = (fieldName: string) =>
  `SELECT ${fieldName} FROM expenses WHERE ${fieldName} IS NOT NULL AND user_id = ?` +
  ` AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date)) AND IFNULL(?, DATE(create_date))`

// 生成批量删除SQL和参数数组
export const batchDeleteExpensesByUserIdAndFields = (
  userId: number,
  records: Array<{
    eat?: string
    drink?: string
    play?: string
    glad?: string
    tolls?: string
    oil?: string
    parking?: string
    phone_bill?: string
    supermarket?: string
    online_shopping?: string
    traffic?: string
    red_packet?: string
    create_date: string
  }>
) => {
  const fields = [
    'eat',
    'drink',
    'play',
    'glad',
    'tolls',
    'oil',
    'parking',
    'phone_bill',
    'supermarket',
    'online_shopping',
    'traffic',
    'red_packet'
  ]

  const wheres: string[] = []
  const params: any[] = []

  records.forEach((item: any) => {
    let cond = [`DATE(create_date) = ?`]
    let condParams: any[] = [item.create_date]

    fields.forEach(field => {
      if (item[field] && item[field] !== '') {
        const values = item[field]!.split(',')
          .map((v: any) => v.trim())
          .filter((v: any) => v !== '')

        if (values.length === 1) {
          cond.push(`${field} = ?`)
          condParams.push(values[0])
        } else if (values.length > 1) {
          cond.push(`${field} IN (${values.map(() => '?').join(',')})`)
          condParams.push(...values)
        }
      }
    })

    // 只有当除了 create_date 外还有至少一个字段时才加入
    if (cond.length > 1) {
      wheres.push(`(${cond.join(' AND ')})`)
      params.push(...condParams)
    }
  })
  console.log(wheres.join(' OR '), params, `数据库`)
  // const sql = `DELETE FROM expenses WHERE user_id = ? AND (${wheres.join(' OR ')})`

  // return { sql, params: [userId, ...params] }
}
