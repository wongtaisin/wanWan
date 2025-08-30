/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:48
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-30 15:33:17
 * @FilePath: \express\service\expensesService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

// 查询所有
export const expensesAll = `SELECT * FROM expenses;`

// 根据 id 查询
export const expensesById = `SELECT * FROM expenses WHERE id = ?;`

// 添加
export const addExpenses = `INSERT INTO expenses (user_id, eat, drink, play, glad, tolls, oil, parking, traffic, supermarket, online_shopping, phone_bill, red_packet, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`

// 根据 id 更新
export const updateExpenses = `UPDATE expenses SET eat = ?, drink = ?, play = ?, glad = ?, tolls = ?, oil = ?, parking = ?, traffic = ?, supermarket = ?, online_shopping = ?, phone_bill = ?, red_packet = ? WHERE id = ?`

// 根据 id 删除
export const deleteExpenses = `DELETE FROM expenses WHERE id = ?;`

export const deleteExpensesAll = `DELETE FROM expenses;`

// 检查日期是否存在
export const checkDate = `SELECT * FROM expenses WHERE DATE(create_date) = ?` // DATE(create_date) 是将 create_date 转换为日期格式，然后再进行比较

export const checkDateByUserId = `SELECT * FROM expenses WHERE DATE(create_date) = ? AND user_id = ?` // DATE(create_date) 是将 create_date 转换为日期格式，然后再进行比较，同时对比 user_id 是否相同
