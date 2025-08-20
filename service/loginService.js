exports.checkUser = `SELECT * FROM user WHERE username = ? OR email = ?`

exports.addUser = `INSERT INTO user (username, password, email, age, sex, create_time) VALUES (?, ?, ?, ?, ?, now())`
