/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-29 09:27:39
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-11 10:38:34
 * @FilePath: \express\service\userService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
exports.userAll = `SELECT * FROM user;`

exports.getUserById = `SELECT * FROM user WHERE id = ?;`

exports.deleteUser = `DELETE FROM user WHERE id = ?;`

exports.updateUser = `UPDATE user SET nick_name = ?, age = ?, sex = ?, status = ?, update_id = ?, update_time = now(), remark = ? WHERE user_id = ?`
