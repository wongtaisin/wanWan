const mysql = require('../db/mysql')

// 注册用户
exports.register = async (req, res) => {
  try {
    const { username, password, email, age, sex } = req.body
    if (!username || !password || !email) {
      return res.status(400).json({ message: '用户名、密码和邮箱都是必填项' })
    }

    // 查询用户是否已存在
    const checkUser = await mysql.query(`SELECT * FROM user WHERE username = ? OR email = ?`, [
      username,
      email
    ])
    if (checkUser.length > 0) {
      return res.status(400).json({ message: '用户名或邮箱已存在' })
    }

    // 插入新用户
    const result = await mysql.query(
      `INSERT INTO user (username, password, email, age, sex, create_time) VALUES (?, ?, ?, ?, ?, now())`,
      [username, password, email, age, sex]
    )

    res.status(201).json({
      message: '注册成功',
      userId: result.insertId,
      username,
      email,
      age,
      sex
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({ message: '注册失败，请稍后重试' })
  }
}
