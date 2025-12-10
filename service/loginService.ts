/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-11 10:40:07
 * @FilePath: \express\service\loginService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
class loginService {
  checkUser = `SELECT * FROM user WHERE user_name = ? OR phone = ?`

  verifyUser = `SELECT * FROM user WHERE user_name = ? AND password = ?`

  addUser = `INSERT INTO user (user_name, password, phone, age, sex, create_time) VALUES (?, ?, ?, ?, ?, now())`

  // 根据用户ID更新登录时间，并且获取 login_ip
  updateLoginTimeAndGetIp = `UPDATE user SET login_date = now(), login_ip = ? WHERE user_id = ?`
}

export default new loginService()
