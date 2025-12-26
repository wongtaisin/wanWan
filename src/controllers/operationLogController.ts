/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-30 16:00:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-25 17:23:19
 * @FilePath: \wanWan\controllers\operationLogController.ts
 * @Description: 操作日志控制器
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

import { Request, Response } from 'express'
import operationLogService from '../service/operationLogService'
import { ReFail, ReSuccess } from '../util/response'

class OperationLogController {
  /**
   * 获取操作日志列表
   */
  async getLogList(req: Request, res: Response) {
    try {
      const {
        page = 1,
        pageSize = 10,
        user_id,
        operation_type,
        module,
        start_time,
        end_time,
        keyword
      } = req.query

      const query = {
        page: Number(page),
        pageSize: Number(pageSize),
        user_id: user_id ? Number(user_id) : undefined,
        operation_type: operation_type as string,
        module: module as string,
        start_time: start_time as string,
        end_time: end_time as string,
        keyword: keyword as string
      }

      const result = await operationLogService.getLogList(query)

      ReSuccess(res, 200, '获取操作日志列表成功', result)
    } catch (error) {
      ReFail(res, '获取操作日志列表失败', error)
    }
  }

  /**
   * 获取操作日志详情
   */
  async getLogDetail(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: '日志ID不能为空',
          data: null
        })
      }

      const log = await operationLogService.getLogById(Number(id))

      if (!log) {
        return res.status(404).json({
          code: 404,
          message: '操作日志不存在',
          data: null
        })
      }

      ReSuccess(res, 200, '获取操作日志详情成功', log)
    } catch (error) {
      ReFail(res, '获取操作日志详情失败', error)
    }
  }

  /**
   * 删除操作日志
   */
  async deleteLog(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          code: 400,
          message: '日志ID不能为空',
          data: null
        })
      }

      const success = await operationLogService.deleteLog(Number(id))

      if (!success) {
        return res.status(404).json({
          code: 404,
          message: '操作日志不存在或删除失败',
          data: null
        })
      }

      ReSuccess(res, 200, '获取操作日志详情成功', null)
    } catch (error) {
      ReFail(res, '删除操作日志失败', error)
    }
  }

  /**
   * 批量删除操作日志
   */
  async batchDeleteLog(req: Request, res: Response) {
    try {
      const { ids } = req.body

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          code: 400,
          message: '日志ID列表不能为空',
          data: null
        })
      }

      const success = await operationLogService.batchDeleteLog(ids)

      if (!success) {
        return res.status(400).json({
          code: 400,
          message: '批量删除操作日志失败',
          data: null
        })
      }

      ReSuccess(res, 200, '批量删除操作日志成功', null)
    } catch (error) {
      ReFail(res, '批量删除操作日志失败', error)
    }
  }

  /**
   * 清理旧日志
   */
  async cleanOldLogs(req: Request, res: Response) {
    try {
      const { beforeDate } = req.body

      if (!beforeDate) {
        return res.status(400).json({
          code: 400,
          message: '清理日期不能为空',
          data: null
        })
      }

      const deletedCount = await operationLogService.cleanOldLogs(beforeDate)

      ReSuccess(res, 200, '清理旧日志成功', { deletedCount })
    } catch (error) {
      ReFail(res, '清理旧日志失败', error)
    }
  }

  /**
   * 获取操作统计信息
   */
  async getOperationStats(req: Request, res: Response) {
    try {
      const { days = 7 } = req.query

      const stats = await operationLogService.getOperationStats(Number(days))

      ReSuccess(res, 200, '获取操作统计信息成功', stats)
    } catch (error) {
      ReFail(res, '获取操作统计信息失败', error)
    }
  }
}

export default new OperationLogController()
