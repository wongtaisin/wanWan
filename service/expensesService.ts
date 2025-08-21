exports.expensesAll = `SELECT * FROM expenses;`

exports.expensesById = `SELECT * FROM expenses WHERE id = ?;`

exports.addExpenses = `INSERT INTO expenses (eat, drink, play, glad, tolls,oil, parking, supermarket, online_shopping,create_time,update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now())`

exports.updateExpenses = `UPDATE expenses SET eat = ?, drink = ?, play = ?, glad = ?, tolls = ?, oil = ?, parking = ?, supermarket = ?, online_shopping = ? WHERE id = ?`

exports.deleteExpenses = `DELETE FROM expenses WHERE id = ?;`

exports.deleteExpensesAll = `DELETE FROM expenses;`
