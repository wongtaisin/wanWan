/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-30 16:00:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-02 13:56:07
 * @FilePath: \express\service\operationLogService.ts
 * @Description: 操作日志服务层
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

import mysql from '../db/mysql'
import { OperationLog, OperationLogQuery, OperationLogResponse } from '../models/operationLog'

class OperationLogService {
  /**
   * 创建操作日志
   */
  async createLog(log: OperationLog): Promise<number> {
    try {
      const sql = `
        INSERT INTO operation_log (
          user_id, user_name, operation_type, module, description,
          request_url, request_method, request_params, response_data,
          ip_address, user_agent, status_code, execution_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const params = [
        log.user_id,
        log.user_name,
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
   * 查询操作日志列表
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
        whereClause += ' AND (description LIKE ? OR user_name LIKE ?)'
        const keyword = `%${query.keyword}%`
        params.push(keyword, keyword)
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
   * 根据ID查询操作日志详情
   */
  async getLogById(id: number): Promise<OperationLog | null> {
    try {
      const sql = 'SELECT * FROM operation_log WHERE id = ?'
      const result: any = await mysql.query(sql, [id] as never[])
      return result.length > 0 ? result[0] : null
    } catch (error) {
      console.error('查询操作日志详情失败:', error)
      throw error
    }
  }

  /**
   * 删除操作日志
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
   * 批量删除操作日志
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
   * 清理指定日期之前的日志
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
   * 获取操作统计信息
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
