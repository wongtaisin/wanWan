/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 09:47:03
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-30 10:25:55
 * @FilePath: \wanWan\service\expensesDetailService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
// 查询所有
export const getIdExpensesDetail = `SELECT * FROM expenses_detail WHERE 1=1 AND id = ?`

/**
 * @desc 添加
 * @param {string} user_id 用户id
 * @param {string} user_name 用户名
 * @param {string} expenses_name 花销名称
 * @param {number} money 花销金额
 * @param {string} create_date 花销日期
 * @example [user_id, user_name, expenses_name, money, create_date]
 * @demo [1, 'wongtaisin', 'eat', 15, '2025-09-01 10:10:10']
 *
 * @explain COALESCE(NULLIF(?, ''), now()) 当 create_date 为空时，使用当前时间
 */
export const add = `INSERT INTO expenses_detail (user_id, user_name, expenses_name, money, remark, create_date) VALUES (?, ?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`

/**
 * @desc 根据 id 更新，其它参数不传时，直接使用数据库里的值
 * @param {number} id 花销详情id
 * @param {string} expenses_name 花销名称
 * @param {number} money 花销金额
 * @param {string} remark 备注
 * @param {string} update_date 更新时间
 * @example [expenses_name, money, remark, update_date, id]
 * @demo ['eat', 15, '备注', '2025-09-01 10:10:10', 1]
 *
 * @explain COALESCE() 用于从参数列表中返回第一个非NULL值，至少需两个参数，遇到第一个非NULL参数后停止后续计算
 * @explain COALESCE(NULLIF(?, ''), now()) 当 update_date 为空时，使用当前时间
 * @explain COALESCE(?, expenses_name) 当 expenses_name 为空时，使用数据库里的值
 */
export const updateExpensesDetail = `UPDATE expenses_detail SET expenses_name = ?, money = COALESCE(?, money), remark = COALESCE(?, remark), update_date = NOW() WHERE id = ?`

// 根据 id 删除
export const deleteExpensesDetailId = `DELETE FROM expenses_detail WHERE id = ?`

// 删除所有
export const deleteExpensesDetailAll = `DELETE FROM expenses_detail`

/**
 * @desc 检查指定日期是否存在
 * @param {number} user_id 用户id
 * @param {string} create_date 花销日期
 * @param {string} expenses_name 花销名称
 * @example [id, create_date, expenses_name]
 * @demo [1, 2025-09-01 10:10:10, 'eat']
 *
 * @explain DATE(create_date) = DATE(?)
    ? = '2025-09-23'，能匹配 2025-09-23 00:00:00 ~ 2025-09-23 23:59:59；
    ? = '2025-09-23 12:30:00'，也能匹配到当天的数据
 */
export const checkTimeByFieldNameExpensesDetail = (type: string = 'YYMMDD hh:mm:ss') => {
  let date = ''
  switch (type) {
    case 'YYMMDD hh:mm:ss':
      date = `AND create_date = ?`
      break
    default:
      date = `AND DATE(create_date) = DATE(?)`
      break
  }
  return `SELECT * FROM expenses_detail WHERE user_id = ? ${date} AND expenses_name = ?`
}

/**
 * @desc 构建查询花销详情的 SQL 语句
 * @param {number} userId 用户id
 * @param {string} expensesName 花销名称
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @returns {object} { sql: string, params: any[] }
 * @example { sql: 'SELECT * FROM expenses_detail WHERE 1=1 AND user_id = ? AND expenses_name = ? AND DATE(create_date) BETWEEN ? AND ?', params: [1, 'eat', '2025-09-01', '2025-09-02'] }
 *
 * @explain DATE() // DATE(create_date) 是将 create_date 转换为日期格式
 * @explain BETWEEN // 用于查询在指定范围内的记录
 */
export const buildQueryExpensesDetail = ({
  userId,
  expensesName,
  startDate,
  endDate
}: {
  userId?: number | null
  expensesName?: string | null
  startDate?: string | null
  endDate?: string | null
}) => {
  let sql = `SELECT * FROM expenses_detail WHERE 1=1`
  const params: any[] = []

  // userId
  if (userId) {
    sql += ` AND user_id = ?`
    params.push(userId)
  }

  // expenses_name
  if (expensesName) {
    sql += ` AND expenses_name = ?`
    params.push(expensesName)
  }

  // 日期范围
  if (startDate && endDate) {
    sql += ` AND DATE(create_date) BETWEEN ? AND ?`
    params.push(startDate, endDate)
  } else if (startDate) {
    sql += ` AND DATE(create_date) >= ?`
    params.push(startDate)
  } else if (endDate) {
    sql += ` AND DATE(create_date) <= ?`
    params.push(endDate)
  }

  return { sql, params }
}

exports.deleteExpensesDetail = `DELETE FROM expenses_detail WHERE id = ?;`

exports.contrastDate = `SELECT ed.*
FROM expenses_detail ed
LEFT JOIN (
  SELECT DISTINCT user_id, DATE(create_date) AS d
  FROM expenses
) e
  ON ed.user_id = e.user_id
 AND DATE(ed.create_date) = e.d
WHERE e.d IS NULL
ORDER BY ed.user_id, ed.create_date;
`
