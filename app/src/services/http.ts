/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-11 16:49:16
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-11 17:00:51
 * @FilePath: \app\src\services\http.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/'

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000
})

http.interceptors.request.use(
  (config: any) => {
    // Example: attach token from storage if exists
    try {
      const token = uni.getStorageSync('token')
      if (token) {
        config.headers = config.headers || {}
        ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
      }
    } catch (e) {}
    return config
  },
  error => Promise.reject(error)
)

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => {
    // Basic error handling
    const message = error?.response?.data?.message || error.message || 'Network Error'
    console.error('HTTP Error:', message)
    return Promise.reject(error)
  }
)

export default http
