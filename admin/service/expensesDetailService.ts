/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 09:47:03
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-23 11:22:53
 * @FilePath: \admin\service\expensesDetailService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
// 查询所有
export const all = `SELECT * FROM expenses_detail`

/**
 * @desc 添加
 * @param {string} user_id 用户id
 * @param {string} user_name 用户名
 * @param {string} expenses_name 花销名称
 * @param {number} money 花销金额
 * @param {string} create_date 花销日期
 * @example [user_id, user_name, expenses_name, money, create_date]
 * @demo [1, 'wongtaisin', 'eat', 15, '2025-09-01 10:10:10']
 *
 * @explain COALESCE(NULLIF(?, ''), now()) 当 create_date 为空时，使用当前时间
 */
export const add = `INSERT INTO expenses_detail (user_id, user_name, expenses_name, money, create_date) VALUES (?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`

// 根据 id 更新
export const update = `UPDATE expenses_detail SET expenses_name = ?, money = ?, WHERE id = ?`

// 根据 id 删除
export const deleteId = `DELETE FROM expenses_detail WHERE id = ?`

// 删除所有
export const deleteAll = `DELETE FROM expenses_detail`

/**
 * @desc 检查指定日期是否存在
 * @param {string} create_date 日期
 * @example [id, create_date]
 * @demo [1, 2025-09-01 10:10:10]
 *
 */
export const checkDate = `SELECT * FROM expenses_detail WHERE id = ? AND create_date = ?`
