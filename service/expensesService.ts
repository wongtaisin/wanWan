/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:48
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-10-18 15:37:38
 * @FilePath: \wanWan\service\expensesService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

// 查询所有
export const expensesAll = `SELECT * FROM expenses`

/**
 * @desc 根据 userId，时间，查询，都可传可不传
 * @param {number} userId 用户ID 可选
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @example [userId, startDate, endDate] 或 [startDate, endDate]
 * @demo [1, '2025-09-01', '2025-09-02'] 或 ['2025-09-01', '2025-09-02']
 *
 * @sql SELECT * FROM expenses WHERE user_id = ?
          AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date))
          AND IFNULL(?, DATE(create_date)) ORDER BY create_date DESC
 *
 * @sql SELECT * FROM expenses WHERE 1=1
          AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date))
          AND IFNULL(?, DATE(create_date)) ORDER BY create_date DESC
 *
 * @explain ORDER BY create_date DESC 是将数据库的 create_date 排序，最新的在前面
 */
export const expensesById = (userId?: number) => {
  const id = userId ? `user_id = ?` : `1=1`
  const date = `AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date)) AND IFNULL(?, DATE(create_date))`

  return `SELECT * FROM expenses WHERE ${id} ${date} ORDER BY create_date DESC`
}

// 添加
export const addExpenses = `INSERT INTO expenses (user_id, user_name, eat, drink, play, glad, tolls, oil, parking, traffic, supermarket, online_shopping, phone_bill, red_packet, vip, other, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`

/**
 * @desc 根据表ID更新 expenses 表中的值
 * @param {string} eat 吃
 * @param {string} drink 喝
 * @param {string} play 玩
 * @param {string} glad 乐
 * @param {string} tolls 过路费
 * @param {string} oil 油
 * @param {string} parking 停车
 * @param {string} traffic 交通
 * @param {string} supermarket 超市
 * @param {string} online_shopping 网购
 * @param {string} phone_bill 电话
 * @param {string} red_packet 红包
 * @param {string} vip vip
 * @param {string} other 其他
 * @param {number} id 表ID
 *
 * @explain UPDATE // 更新 expenses 表中的值
 */
export const updateExpenses = `UPDATE expenses SET eat = ?, drink = ?, play = ?, glad = ?, tolls = ?, oil = ?, parking = ?, traffic = ?, supermarket = ?, online_shopping = ?, phone_bill = ?, red_packet = ?, vip = ?, other = ? WHERE id = ?`

/**
 * @desc 更改指定字段的值，根据表ID
 * @param {string} fieldName 字段名
 * @param {string} value 要更改的值
 * @param {number} id 表ID
 * @example [value, id]
 * @demo ['2,15', 1]
 */
export const updateExpensesFieldName = (fieldName: string) => {
  return `UPDATE expenses SET ${fieldName} = ? WHERE id = ?`
}

/**
 * @desc 更改指定日期的值，根据 用户ID 和 时间
 * @param {string} fieldName 字段名，补充在 sql expenses 表中
 * @param {string} value 要更改的值
 * @param {number} user_id 用户ID
 * @param {string} create_date 日期
 * @example [value, user_id, create_date]
 * @demo ['2,15', 1, '2025-09-01']
 */
export const updateExpensesDate = (fieldName: string) => {
  return `UPDATE expenses
          SET ${fieldName} = ?
          WHERE user_id = ?
            AND DATE(create_date) = DATE(?)`
}

/**
 * @desc 添加指定字段的值，支持用户ID
 * @param {string} fieldName 字段名，补充在 sql expenses 表中
 * @param {number} user_id 用户ID
 * @param {string} user_name 用户名
 * @param {string} value 要添加的值
 * @param {string} create_date 日期
 * @example [user_id, user_name, value, create_date]
 * @demo [1, '大帅', '2', '2025-09-01']
 *
 * @explain COALESCE(NULLIF(?, ''), now()) // 如果 create_date 为空，则使用当前日期
 */
export const addExpensesFieldName = (fieldName: string) => {
  return `INSERT INTO expenses (user_id, user_name, ${fieldName}, create_date) VALUES (?, ?, ?, COALESCE(NULLIF(?, ''), now()))`
}

// 删除所有
export const deleteExpensesAll = `DELETE FROM expenses`

/**
 * @desc 检查指定日期是否存在
 * @param {string} create_date 日期
 * @example [create_date]
 * @demo [2025-09-01]
 *
 * @explain DATE(create_date) 是将数据库的 create_date 转换为日期格式
 */
export const checkDate = `SELECT * FROM expenses WHERE DATE(create_date) = ?` // DATE(create_date) 是将 create_date 转换为日期格式，然后再进行比较

/**
 * @desc 查询指定字段的值，支持用户ID和可选的日期范围（不限制日期，可传可不传）
 * @param {string} fieldName 字段名
 * @param {number} userId 用户ID
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @example [fieldName, userId, startDate, endDate]
 * @demo [eat, 1, '2025-09-01', '2025-09-02']
 *
 * @explain DATE() // DATE(create_date) 是将 create_date 转换为日期格式
 */
export const checkDateByUserId = `SELECT * FROM expenses WHERE DATE(create_date) = ? AND user_id = ?` // DATE(create_date) 是将 create_date 转换为日期格式，然后再进行比较，同时对比 user_id 是否相同

/**
 * @desc 查询指定字段的值，支持用户ID和可选的日期范围（不限制日期，可传可不传）
 * @param {string} fieldName 字段名，必填
 * @param {number} userId 用户ID，直接从 req.auth.user_id 获取
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @example [userId, startDate, endDate]
 * @demo [1, '2025-09-01', '2025-09-02']
 *
 * @explain DATE() // DATE(create_date) 是将 create_date 转换为日期格式
 * @explain BETWEEN // 用于查询在指定范围内的记录
 * @explain IFNULL(?, DATE(create_date)) // 如果 startDate 为空，则使用当前日期
 * @explain DATE_FORMAT(create_date, '%Y-%m-%d') AS create_date // 将 create_date 转换为日期格式，格式为 'YYYY-MM-DD'
 *
 * @sql SELECT id, eat, DATE_FORMAT(create_date, '%Y-%m-%d') AS create_date FROM expenses
        WHERE eat IS NOT NULL
          AND user_id = ?
          AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date)) AND IFNULL(?, DATE(create_date))
 */
export const getFieldValues = (fieldName: string) =>
  `SELECT id, ${fieldName}, DATE_FORMAT(create_date, '%Y-%m-%d') AS create_date FROM expenses WHERE ${fieldName} IS NOT NULL AND user_id = ? AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date)) AND IFNULL(?, DATE(create_date))`

// 生成批量 UPDATE SQL 和参数数组（删除字段里部分值）,每一个值都会循环执行一次 SQL 语句
export const batchDeleteExpenses = (
  records: Array<{
    id: number
    user_id: number
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
    vip?: string
    other?: string
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
    'red_packet',
    'vip',
    'other'
  ]

  const sql: string[] = [] // 存储所有 SQL 语句
  const params: any[] = [] // 存储所有参数

  records.forEach((item: any) => {
    fields.forEach(field => {
      if (item[field] && item[field] !== '') {
        // 按逗号拆分成单个值
        const values = item[field]!.split(',')
          .map((v: any) => v.trim())
          .filter((v: any) => v !== '')

        // 为每个要删除的值创建单独的SQL语句
        values.forEach((value: string | number) => {
          /**
           * @desc 添加参数：value用于SET语句，id，user_id，create_date用于WHERE条件，value再次用于WHERE条件中的REGEXP，使用 REGEXP_REPLACE 的第四个参数指定只替换第一个匹配项
           * @param {string} value 用在 REGEXP_REPLACE 正则里，表示要删除的那个值。
           * @param {number} id 主键ID
           * @param {number} user_id 用户ID
           * @param {string} create_date 日期
           * @param {string} value 用在 WHERE eat REGEXP CONCAT('(^|,)', ?, '(,|$)') 里，确认 eat 字段里确实包含 'value' 才会执行更新。
           * @example [value, id, user_id, create_date, value]
           * @demo [2, 7, 1, '2025-09-01', 2]
           *
           * @explain TRIM 用于删除字符串两端的空格或指定的字符。
           * @explain BOTH 表示删除字符串两端的空格或指定的字符。
           * @explain CONCAT 用于连接多个字符串。
           * @explain REGEXP_REPLACE 函数用于替换字符串中匹配正则表达式的部分。
           * @sql UPDATE expenses
                    SET eat = TRIM(BOTH ',' FROM REGEXP_REPLACE(eat, CONCAT('(^|,)', ?, '(,|$)'), ',', 1, 1))
                    WHERE id = ?
                      AND user_id = ?
                      AND DATE(create_date) = ?
                      AND eat REGEXP CONCAT('(^|,)', ?, '(,|$)')
                    LIMIT 1;
           */
          sql.push(`
            UPDATE expenses
            SET ${field} = TRIM(BOTH ',' FROM REGEXP_REPLACE(${field}, CONCAT('(^|,)', ?, '(,|$)'), ',', 1, 1))
            WHERE id = ? AND user_id = ? AND DATE(create_date) = ? AND ${field} REGEXP CONCAT('(^|,)', ?, '(,|$)')
            LIMIT 1
          `)

          params.push([value, item.id, item.user_id, item.create_date, value])
        })
      }
    })
  })

  return { sql, params }
}

// 删除id
export const deleteExpensesByUserIdAndDate = `DELETE FROM expenses WHERE user_id = ? AND DATE(create_date) = ?`
