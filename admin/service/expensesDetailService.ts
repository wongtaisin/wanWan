/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 09:47:03
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-25 15:46:31
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
export const add = `INSERT INTO expenses_detail (user_id, user_name, expenses_name, money, remark, create_date) VALUES (?, ?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`

/**
 * @desc 根据 id 更新，其它参数不传时，直接使用数据库里的值
 * @param {number} id 花销详情id
 * @param {string} expenses_name 花销名称
 * @param {number} money 花销金额
 * @param {string} remark 备注
 * @param {string} update_date 更新时间
 * @example [expenses_name, money, remark, update_date, id]
 * @demo ['eat', 15, '备注', '2025-09-01 10:10:10', 1]
 *
 * @explain COALESCE() 用于从参数列表中返回第一个非NULL值，至少需两个参数，遇到第一个非NULL参数后停止后续计算
 * @explain COALESCE(NULLIF(?, ''), now()) 当 update_date 为空时，使用当前时间
 * @explain COALESCE(?, expenses_name) 当 expenses_name 为空时，使用数据库里的值
 */
export const updateExpensesDetail = `UPDATE expenses_detail SET expenses_name = ?, money = COALESCE(?, money), remark = COALESCE(?, remark), update_date = COALESCE(?, NOW()) WHERE id = ?`

// 根据 id 删除
export const deleteExpensesDetailId = `DELETE FROM expenses_detail WHERE id = ?`

// 删除所有
export const deleteExpensesDetailAll = `DELETE FROM expenses_detail`

/**
 * @desc 检查指定日期是否存在
 * @param {number} user_id 用户id
 * @param {string} create_date
 * @param {string} expenses_name 花销名称
 * @example [id, create_date, expenses_name]
 * @demo [1, 2025-09-01 10:10:10, 'eat']
 */
export const checkDateByUserIdAndName = `SELECT * FROM expenses_detail WHERE user_id = ? AND create_date = ? AND expenses_name = ?`
