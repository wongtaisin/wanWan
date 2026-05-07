/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-30 16:00:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-25 17:08:24
 * @FilePath: \wanWan\service\operationLogService.ts
 * @Description: 操作日志服务层
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

import mysql from '../config/mysql'
import { OperationLog, OperationLogQuery, OperationLogResponse } from '../models/operationLog'

class OperationLogService {
  /**
   * @description: 创建操作日志
   * @param {OperationLog} log - 操作日志对象
   * @return {Promise<number>} - 操作日志ID
   *
   * @example 假设 log = {
   *   user_id: 1,
   *   operation_type: 'login',
   *   module: 'user',
   *   description: '用户登录',
   *   request_url: '/user/login',
   *   request_method: 'POST',
   *   request_params: '{"username": "wingddd", "password": "123456"}',
   *   response_data: '{"token": "123456"}',
   *   ip_address: '127.0.0.1'
   *   user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
   *   status_code: 200
   *   execution_time: 100
   * }
   */
  async createLog(log: OperationLog): Promise<number> {
    try {
      const sql = `
        INSERT INTO operation_log (
          user_id, operation_type, module, description,
          request_url, request_method, request_params, response_data,
          ip_address, user_agent, status_code, execution_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const params = [
        log.user_id,
        log.operation_type,
        log.module,
        log.description,
        log.request_url,
        log.request_method,
        log.request_params,
        log.response_data,
        log.ip_address,
        log.user_agent,
        log.status_code,
        log.execution_time
      ] as never[]

      const result: any = await mysql.query(sql, params)
      return result.insertId
    } catch (error) {
      console.error('创建操作日志失败:', error)
      throw error
    }
  }

  /**
   * @description: 查询操作日志列表
   * @param {OperationLogQuery} query - 查询参数
   * @return {Promise<OperationLogResponse>} - 操作日志列表响应
   *
   * @example 假设 query = { user_id: 1, operation_type: 'login', module: 'user', start_time: '2025-11-25 00:00:00', end_time: '2025-11-25 23:59:59' },
   * 则返回用户ID为1、操作类型为login、模块为user、在2025-11-25 00:00:00至2025-11-25 23:59:59之间的操作日志列表
   */
  async getLogList(query: OperationLogQuery): Promise<OperationLogResponse> {
    try {
      let whereClause = 'WHERE 1=1'
      const params: any = []

      if (query.user_id) {
        whereClause += ' AND user_id = ?'
        params.push(query.user_id)
      }

      if (query.operation_type) {
        whereClause += ' AND operation_type = ?'
        params.push(query.operation_type)
      }

      if (query.module) {
        whereClause += ' AND module = ?'
        params.push(query.module)
      }

      if (query.start_time) {
        whereClause += ' AND create_time >= ?'
        params.push(query.start_time)
      }

      if (query.end_time) {
        whereClause += ' AND create_time <= ?'
        params.push(query.end_time)
      }

      if (query.keyword) {
        whereClause += ' AND description LIKE ?'
        const keyword = `%${query.keyword}%`
        params.push(keyword)
      }

      // 查询总数
      const countSql = `SELECT COUNT(*) as total FROM operation_log ${whereClause}`
      const countResult: any = await mysql.query(countSql, params)
      const total = countResult[0].total

      // 查询列表
      const page = query.page || 1
      const pageSize = query.pageSize || 10
      const offset = (page - 1) * pageSize

      const listSql = `
        SELECT * FROM operation_log
        ${whereClause}
        ORDER BY create_time DESC
        LIMIT ? OFFSET ?
      `
      const listParams = [...params, pageSize, offset] as never[]
      const list: any = await mysql.query(listSql, listParams)

      return {
        total,
        list,
        page,
        pageSize
      }
    } catch (error) {
      console.error('查询操作日志失败:', error)
      throw error
    }
  }

  /**
   * @description: 根据ID查询操作日志详情
   * @param {number} id - 操作日志ID
   * @return {Promise<OperationLog | null>} - 操作日志详情或null
   *
   * @example 假设 id = 1, 则返回ID为1的操作日志详情
   */
  async getLogById(id: number): Promise<OperationLog | null> {
    try {
      const sql =
        'SELECT *, DATE_FORMAT(create_time, "%Y-%m-%d %H:%i:%s") AS create_time FROM operation_log WHERE id = ?'
      const result: any = await mysql.query(sql, [id] as never[])
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error('查询操作日志详情失败:', error)
      throw error
    }
  }

  /**
   * @description: 删除操作日志
   * @param {number} id - 操作日志ID
   * @return {Promise<boolean>} - 是否删除成功
   *
   * @example 假设 id = 1, 则删除ID为1的操作日志
   */
  async deleteLog(id: number): Promise<boolean> {
    try {
      const sql = 'DELETE FROM operation_log WHERE id = ?'
      const result: any = await mysql.query(sql, [id] as never[])
      return result.affectedRows > 0
    } catch (error) {
      console.error('删除操作日志失败:', error)
      throw error
    }
  }

  /**
   * @description: 批量删除操作日志
   * @param {number[]} ids - 操作日志ID列表
   * @return {Promise<boolean>} - 是否删除成功
   *
   * @example 假设 ids = [1, 2, 3], 则删除ID为1、2、3的操作日志
   */
  async batchDeleteLog(ids: number[]): Promise<boolean> {
    try {
      const placeholders = ids.map(() => '?').join(',')
      const sql = `DELETE FROM operation_log WHERE id IN (${placeholders})`
      const result: any = await mysql.query(sql, ids as never[])
      return result.affectedRows > 0
    } catch (error) {
      console.error('批量删除操作日志失败:', error)
      throw error
    }
  }

  /**
   * @deprecated 清理指定日期之前的日志
   * @param {string} beforeDate - 清理日期，格式为YYYY-MM-DD
   * @return {Promise<number>} - 受影响的行数
   *
   * @example 假设 beforeDate = '2025-11-25', 则删除该日期之前的所有操作日志
   */
  async cleanOldLogs(beforeDate: string): Promise<number> {
    try {
      const sql = 'DELETE FROM operation_log WHERE create_time < ?'
      const result: any = await mysql.query(sql, [beforeDate] as never[])
      return result.affectedRows
    } catch (error) {
      console.error('清理旧日志失败:', error)
      throw error
    }
  }

  /**
   * @description: 获取操作统计信息
   * @param {number} days - 统计时间范围（天），默认7天
   * @return {Promise<any[]>} - 操作统计信息列表
   *
   * @example 假设 days = 7, 则结果为
   * [
   *   { date: '2025-11-25', operation_type: 'create', count: 123 },
   *   { date: '2025-11-25', operation_type: 'update', count: 45 },
   *   ...
   * ]
   * @demo const stats = await operationLogService.getOperationStats() // 获取最近7天的操作统计信息
   * @demo const stats30 = await operationLogService.getOperationStats(30) // 获取最近30天的操作统计信息
   */
  async getOperationStats(days: number = 7): Promise<any[]> {
    try {
      const sql = `
        SELECT
          DATE(create_time) as date,
          operation_type,
          COUNT(*) as count
        FROM operation_log
        WHERE create_time >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY DATE(create_time), operation_type
        ORDER BY date DESC, count DESC
      `
      const result: any = await mysql.query(sql, [days] as never[])
      return result
    } catch (error) {
      console.error('获取操作统计失败:', error)
      throw error
    }
  }
}

export default new OperationLogService()
