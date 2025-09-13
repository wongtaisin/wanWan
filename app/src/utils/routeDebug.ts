/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-01-11 17:45:00
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-01-11 17:45:00
 * @FilePath: \app\src\utils\routeDebug.ts
 * @Description: 路由调试工具
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

import { getPlatformInfo } from '@/router/platform'

// 路由调试信息
export function getRouteDebugInfo() {
  const platformInfo = getPlatformInfo()

  return {
    platform: platformInfo,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    uniEnv: {
      // @ts-ignore
      platform: process.env.UNI_PLATFORM || 'unknown',
      // @ts-ignore
      version: process.env.UNI_VERSION || 'unknown'
    }
  }
}

// 打印路由调试信息
export function logRouteDebugInfo() {
  const debugInfo = getRouteDebugInfo()
  console.log('🚀 路由调试信息:', debugInfo)
  return debugInfo
}

// 检查路由是否可用
export function checkRouteAvailability(router: any): boolean {
  if (!router) {
    console.warn('❌ 路由实例不存在')
    return false
  }

  if (typeof router.push !== 'function') {
    console.warn('❌ 路由 push 方法不可用')
    return false
  }

  if (typeof router.replace !== 'function') {
    console.warn('❌ 路由 replace 方法不可用')
    return false
  }

  console.log('✅ 路由功能正常')
  return true
}
