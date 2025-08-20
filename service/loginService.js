exports.checkUser = `SELECT * FROM user WHERE username = ? OR email = ?`

exports.verifyUser = `SELECT * FROM user WHERE username = ? AND password = ?`

exports.addUser = `INSERT INTO user (username, password, email, age, sex, create_time) VALUES (?, ?, ?, ?, ?, now())`
