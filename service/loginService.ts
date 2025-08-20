export const checkUser = `SELECT * FROM user WHERE username = ? OR email = ?`

export const verifyUser = `SELECT * FROM user WHERE username = ? AND password = ?`

export const addUser = `INSERT INTO user (username, password, email, age, sex, create_time) VALUES (?, ?, ?, ?, ?, now())`
