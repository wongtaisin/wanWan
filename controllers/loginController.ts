import mysql from '../db/mysql'
const loginService = require('../service/loginService')

// 注册用户
exports.register = async (req: any, res: any) => {
  try {
    const { username, password, email, age, sex } = req.body
    if (!username || !password || !email) {
      return res.status(400).json({ message: '用户名、密码和邮箱都是必填项' })
    }

    // 查询用户是否已存在
    const checkUser: any = await mysql.query(loginService.checkUser, [username, email] as never[])

    if (checkUser.length > 0) {
      return res.status(400).json({ message: '用户名或邮箱已存在' })
    }

    // 插入新用户
    const result: any = await mysql.query(loginService.addUser, [
      username,
      password,
      email,
      age,
      sex
    ] as never[])

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

const jwt = require('jsonwebtoken')
// 登录
exports.login = async (req: any, res: any) => {
  let { username } = req.body

  // 登录成功，签发一个token并返回给前端
  const token = jwt.sign(
    // payload：签发的 token 里面要包含的一些数据
    { username },
    // 私钥
    'caowj',
    // 设置过期时间
    { expiresIn: 60 * 60 * 24 } //1 day
  )

  res.json({
    msg: '登录成功',
    data: { token }
  })
}
