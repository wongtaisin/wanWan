/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 16:38:48
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-08-25 10:11:28
 * @FilePath: \express\service\expensesService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
exports.expensesAll = `SELECT * FROM expenses;`

exports.expensesById = `SELECT * FROM expenses WHERE id = ?;`

exports.addExpenses = `INSERT INTO expenses (eat, drink, play, glad, tolls, oil, parking, traffic, supermarket, online_shopping, phone_bill, red_packet, create_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), ?)`

exports.updateExpenses = `UPDATE expenses SET eat = ?, drink = ?, play = ?, glad = ?, tolls = ?, oil = ?, parking = ?, traffic = ?, supermarket = ?, online_shopping = ?, phone_bill = ?, red_packet = ? WHERE id = ?`

exports.deleteExpenses = `DELETE FROM expenses WHERE id = ?;`

exports.deleteExpensesAll = `DELETE FROM expenses;`

exports.checkDate = `SELECT * FROM expenses WHERE create_date = ?`
