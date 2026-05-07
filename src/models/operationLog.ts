/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-30 16:00:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-30 16:00:00
 * @FilePath: \express\models\operationLog.ts
 * @Description: 操作日志模型
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

export interface OperationLog {
  id?: number
  user_id?: number
  operation_type: string
  module: string
  description: string
  request_url?: string
  request_method?: string
  request_params?: string
  response_data?: string
  ip_address?: string
  user_agent?: string
  status_code?: number
  execution_time?: number
  create_time?: Date
}

export interface OperationLogQuery {
  page?: number
  pageSize?: number
  user_id?: number
  operation_type?: string
  module?: string
  start_time?: string
  end_time?: string
  keyword?: string
}

export interface OperationLogResponse {
  total: number
  list: OperationLog[]
  page: number
  pageSize: number
}
