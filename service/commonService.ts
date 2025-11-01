/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-17 14:43:25
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-01 17:21:56
 * @FilePath: \wanWan\service\commonService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql'

/**
 * @desc 获取消费明细列表 + 总数统计
 * @param {Object} filters 查询条件
 * @param {number|null} filters.userId 用户ID（可选）
 * @param {string[]|null} filters.expensesName 消费名称（可选）
 * @param {string|null} filters.startDate 开始时间（可选）
 * @param {string|null} filters.endDate 结束时间（可选）
 * @param {number} filters.limit 每页数量（默认10）
 * @param {number} filters.offset 偏移量（默认0）
 * @param {string} filters.orderBy 排序字段（默认create_date）
 * @param {string} filters.order 排序方向（默认DESC）
 * @returns {{ list: any[], total: number }}
 */
export interface ExpensesDetailFilters {
  userId?: number | null
  userName?: string | null // 支持模糊查询
  expensesName?: string[] | null // 支持数组查询
  startDate?: string | null
  endDate?: string | null
  limit?: number
  offset?: number
  orderBy?: string
  sort?: 'ASC' | 'DESC'
}

export interface ExpensesDetailResult {
  list: any[]
  total: number
}

export async function queryExpensesDetailList(
  filters: ExpensesDetailFilters = {}
): Promise<ExpensesDetailResult> {
  const {
    userId = null,
    userName = null,
    expensesName = null,
    startDate = null,
    endDate = null,
    limit = 10,
    offset = 0,
    orderBy = 'create_date',
    sort = 'DESC'
  } = filters

  // -----------------------
  // ✅ 公共SQL片段（WHERE）
  // -----------------------
  let sql = 'WHERE 1=1'
  const params = [] as any // 用于分页查询的参数

  if (userId) {
    sql += ' AND user_id = ?'
    params.push(userId)
  }

  // ✅ userName 模糊查询
  if (userName) {
    sql += ' AND user_name LIKE CONCAT("%", ?, "%")'
    params.push(userName.trim())
  }

  // ✅ 数组 ['eat', 'play']
  if (expensesName && expensesName.length > 0) {
    // expensesName.split(',').map(s => s.trim()) // 处理逗号分隔的字符串，例如: 'eat, play' => ['eat', 'play']
    const placeholders = expensesName.map(() => '?').join(', ')
    sql += ` AND expenses_name IN (${placeholders})`
    params.push(...expensesName)
  }

  if (startDate && endDate) {
    sql += ` AND DATE(create_date) BETWEEN ? AND ?`
    params.push(startDate, endDate)
  }

  /**
   * @desc ✅ 获取消费明细列表总数
   * @param {string} sql 公共SQL片段（WHERE）
   * @param {any[]} params 查询参数
   * @param {number|null} userId 用户ID，可选
   * @param {string|null} userName 用户名，可选
   * @param {string[]|null} expensesName 消费名称，可选
   * @param {string|null} startDate 开始时间，可选
   * @param {string|null} endDate 结束时间，可选
   * @returns {number} 消费明细列表总数
   * @example [userId, userName, expensesName, startDate, endDate]
   * @demo [1, '大帅', 'eat', '2025-09-01', '2025-09-02']
   *
   * @sql SELECT COUNT(*) AS total
            FROM expenses_detail
            WHERE 1=1 AND user_id = ?
              AND user_name LIKE CONCAT("%", ?, "%")
              AND expenses_name IN (?)
              AND DATE(create_date) BETWEEN ? AND ?
   */

  const totalSql = `
    SELECT COUNT(*) AS total
    FROM expenses_detail
    ${sql}
  `
  // console.log(totalSql, params, `列表总数`)
  const totalRows: any = await mysql.query(totalSql, params)
  const total = totalRows?.[0]?.total ?? 0

  /**
   * @desc ✅ 获取分页数据
   * @param {string} sql 公共SQL片段（WHERE）
   * @param {any[]} params 查询参数
   * @param {number|null} userId 用户ID，可选
   * @param {string|null} userName 用户名，可选
   * @param {string[]|null} expensesName 消费名称，可选
   * @param {string|null} startDate 开始时间，可选
   * @param {string|null} endDate 结束时间，可选
   * @param {number} limit 每页数量（默认10）
   * @param {number} offset 偏移量（默认0）
   * @param {string} orderBy 排序字段（默认create_date）
   * @param {string} sort 排序方向（默认DESC，升序）
   * @returns {any[]} 消费明细列表
   * @example [userId, userName, expensesName, startDate, endDate, limit, offset]
   * @demo [1, '大帅', 'eat', '2025-09-01', '2025-09-02', 10, 0]
   *
   * @sql SELECT *, DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date
            FROM expenses_detail
            WHERE 1=1 AND user_id = ?
              AND user_name LIKE CONCAT("%", ?, "%")
              AND expenses_name IN (?)
              AND DATE(create_date) BETWEEN ? AND ?
            ORDER BY create_date DESC
            LIMIT ? OFFSET ?

    @explain DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date // 将 create_date 转换为日期格式，格式为 'YYYY-MM-DD HH:MM:SS'
   */
  const dataSql = `
    SELECT *, DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date
    FROM expenses_detail
    ${sql}
    ORDER BY ${orderBy} ${sort}
    LIMIT ? OFFSET ?
  `
  const dataParams: any = [...params, Number(limit), Number(offset)]
  // console.log(dataSql, dataParams, `获取分页数据`)
  const list: any = await mysql.query(dataSql, dataParams)

  return { list, total }
}
