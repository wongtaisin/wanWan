/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-09 16:56:53
 * @FilePath: \express\service\loginService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
export const checkUser = `SELECT * FROM user WHERE user_name = ? OR phone = ?`

export const verifyUser = `SELECT * FROM user WHERE user_name = ? AND password = ?`

export const addUser = `INSERT INTO user (user_name, password, phone, age, sex, create_time) VALUES (?, ?, ?, ?, ?, now())`

// 根据用户ID更新登录时间
export const updateUser = `UPDATE user SET nick_name = ?, age = ?, sex = ?, age = ?,login_ip = ?, login_date = now(), status = ?, update_id = ?, update_time = ?, remark = ? WHERE user_id = ?`
