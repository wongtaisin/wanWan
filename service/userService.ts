/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-29 09:27:39
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-03 15:52:39
 * @FilePath: \wanWan\service\userService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
exports.getUserById = `SELECT * FROM user WHERE user_id = ?`

exports.deleteUser = `DELETE FROM user WHERE user_id = ?`

exports.updateUser = `UPDATE user SET nick_name = ?, age = ?, sex = ?, status = ?, update_id = ?, update_time = now(), remark = ? WHERE user_id = ?`
