/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-03 15:41:40
 * @FilePath: \wanWan\controllers\userController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../config/mysql' // 引入mysql模块
import userService from '../service/userService' // 引入userService模块
import { recordDeleteLog, recordQueryLog } from '../util/operationLogUtil' // 引入操作日志工具

class userController {
  // 删除用户
  deleteUser = async (req: any, res: any) => {
    const { id }: { id: number } = req.params

    try {
      // 检查用户是否存在
      const user = (await mysql.query(userService.getUserById, [id] as any)) as any[]

      if (user.length === 0) {
        return res.status(404).json({
          code: 404,
          id,
          message: '用户不存在'
        })
      }

      // 执行删除操作
      await mysql.query(userService.deleteUser, [id] as any)

      // 记录删除操作日志
      if (req.user) {
        await recordDeleteLog(
          req.user.user_id,
          req.user.user_name,
          'user',
          `删除用户: ${user[0].user_name || '未知用户'}`,
          { userId: id }
        )
      }

      res.json({
        code: 200,
        id,
        message: '删除成功'
      })
    } catch (error: any) {
      console.error('删除用户失败:', error)
      res.status(500).json({
        message: '删除用户失败',
        error: error.message
      })
    }
  }

  // 获取用户列表
  getUser = async (req: any, res: any) => {
    try {
      const data = await mysql.query(userService.userAll)
      const jsonData = JSON.parse(JSON.stringify(data))

      // 记录查询操作日志
      if (req.user) {
        await recordQueryLog(req.user.user_id, req.user.user_name, 'user', '获取用户列表', {
          page: req.query.page,
          pageSize: req.query.pageSize
        })
      }

      res.json({
        code: 200,
        data: jsonData,
        message: '获取成功'
      })
    } catch (error: any) {
      console.error('获取用户列表失败:', error)
      res.status(500).json({
        code: 500,
        message: '获取用户列表失败',
        error: error.message
      })
    }
  }

  // 获取用户信息
  getUserInfo = async (req: any, res: any) => {
    const { user_id }: { user_id: number } = req.auth

    try {
      // 检查用户是否存在
      const user = (await mysql.query(userService.getUserById, [user_id] as any)) as any[]

      if (user.length === 0) {
        return res.status(404).json({
          code: 404,
          user_id,
          message: '用户不存在'
        })
      }
      const userInfo = user[0]

      res.status(200).json({
        code: 200,
        data: {
          user: {
            userId: userInfo.user_id,
            userName: userInfo.user_name,
            phone: userInfo.phone
          },
          permissions: user_id === 1 ? ['*:*:*'] : [] // 管理员默认有所有权限，获取数据需要 JSON.stringify 转 JSON.parse
        },
        message: '获取成功'
      })
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      res.status(500).json({
        message: '获取用户信息失败',
        error: error.message
      })
    }
  }
}

export default new userController()
