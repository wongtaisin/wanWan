/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-30 16:00:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-02 13:50:42
 * @FilePath: \express\util\operationLogUtil.ts
 * @Description: 操作日志工具函数
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

import { OperationLog } from '../models/operationLog'
import operationLogService from '../service/operationLogService'

/**
 * 手动记录操作日志
 * @param logData 日志数据
 */
export const recordOperationLog = async (logData: Partial<OperationLog>) => {
  try {
    await operationLogService.createLog(logData as OperationLog)
  } catch (error) {
    console.error('手动记录操作日志失败:', error)
  }
}

/**
 * 记录用户登录日志
 * @param userId 用户ID
 * @param userName 用户名
 * @param ipAddress IP地址
 * @param userAgent 用户代理
 */
export const recordLoginLog = async (
  userId: number,
  userName: string,
  ipAddress?: string,
  userAgent?: string
) => {
  await recordOperationLog({
    user_id: userId,
    operation_type: 'LOGIN',
    module: 'login',
    description: `用户 ${userName} 登录系统`,
    ip_address: ipAddress,
    user_agent: userAgent
  })
}

/**
 * 记录用户登出日志
 * @param userId 用户ID
 * @param userName 用户名
 * @param ipAddress IP地址
 */
export const recordLogoutLog = async (userId: number, userName: string, ipAddress?: string) => {
  await recordOperationLog({
    user_id: userId,
    operation_type: 'LOGOUT',
    module: 'login',
    description: `用户 ${userName} 登出系统`,
    ip_address: ipAddress
  })
}

/**
 * 记录创建操作日志
 * @param userId 用户ID
 * @param userName 用户名
 * @param module 模块名
 * @param description 操作描述
 * @param requestData 请求数据
 */
export const recordCreateLog = async (
  userId: number,
  userName: string,
  module: string,
  description: string,
  requestData?: any
) => {
  await recordOperationLog({
    user_id: userId,
    operation_type: 'CREATE',
    module: module,
    description: description,
    request_params: requestData ? JSON.stringify(requestData) : undefined
  })
}

/**
 * 记录更新操作日志
 * @param userId 用户ID
 * @param userName 用户名
 * @param module 模块名
 * @param description 操作描述
 * @param requestData 请求数据
 */
export const recordUpdateLog = async (
  userId: number,
  userName: string,
  module: string,
  description: string,
  requestData?: any
) => {
  await recordOperationLog({
    user_id: userId,
    operation_type: 'UPDATE',
    module: module,
    description: description,
    request_params: requestData ? JSON.stringify(requestData) : undefined
  })
}

/**
 * 记录删除操作日志
 * @param userId 用户ID
 * @param userName 用户名
 * @param module 模块名
 * @param description 操作描述
 * @param requestData 请求数据
 */
export const recordDeleteLog = async (
  userId: number,
  userName: string,
  module: string,
  description: string,
  requestData?: any
) => {
  await recordOperationLog({
    user_id: userId,
    operation_type: 'DELETE',
    module: module,
    description: description,
    request_params: requestData ? JSON.stringify(requestData) : undefined
  })
}

/**
 * 记录查询操作日志
 * @param userId 用户ID
 * @param userName 用户名
 * @param module 模块名
 * @param description 操作描述
 * @param requestData 请求数据
 */
export const recordQueryLog = async (
  userId: number,
  userName: string,
  module: string,
  description: string,
  requestData?: any
) => {
  await recordOperationLog({
    user_id: userId,
    operation_type: 'QUERY',
    module: module,
    description: description,
    request_params: requestData ? JSON.stringify(requestData) : undefined
  })
}

/**
 * 记录异常操作日志
 * @param userId 用户ID
 * @param userName 用户名
 * @param module 模块名
 * @param description 操作描述
 * @param errorMessage 错误信息
 * @param requestData 请求数据
 */
export const recordErrorLog = async (
  userId: number,
  userName: string,
  module: string,
  description: string,
  errorMessage: string,
  requestData?: any
) => {
  await recordOperationLog({
    user_id: userId,
    operation_type: 'ERROR',
    module: module,
    description: `${description} - ${errorMessage}`,
    request_params: requestData ? JSON.stringify(requestData) : undefined
  })
}
