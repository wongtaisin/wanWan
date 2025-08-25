/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-25 16:13:16
 * @FilePath: \express\service\loginService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
export const checkUser = `SELECT * FROM user WHERE user_name = ? OR phone = ?`

export const verifyUser = `SELECT * FROM user WHERE user_name = ? AND password = ?`

export const addUser = `INSERT INTO user (user_name, password, phone, age, sex, create_time) VALUES (?, ?, ?, ?, ?, now())`
