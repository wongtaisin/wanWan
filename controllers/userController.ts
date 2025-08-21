/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-21 16:47:47
 * @FilePath: \express\controllers\userController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../db/mysql' // 引入mysql模块
const userService = require('../service/userService') // 引入userService模块

// 删除用户
exports.deleteUser = async (req: any, res: any) => {
  const { id }: { id: number } = req.params

  // 检查用户是否存在
  const user = (await mysql.query(userService.getUserById, [id] as any)) as any[]

  if (user.length === 0) {
    return res.status(404).json({
      message: '用户不存在',
      id
    })
  }

  // 执行删除操作
  await mysql.query(userService.deleteUser, [id] as any)
  res.status(200).json({
    message: '删除成功',
    id
  })
}

// 获取用户列表
exports.getUser = (req: any, res: any) => {
  mysql.query(userService.userAll).then((data: any) => {
    let jsonData = JSON.parse(JSON.stringify(data))
    res.json({
      data: jsonData
    })
  })
}
