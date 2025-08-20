import express from 'express' // 引入express模块
import mysql from '../db/mysql'
const loginController = require('../controllers/loginController') // 登录控制器
const router = express.Router() //模块化路由
const loginService = require('../service/loginService')

router.post('/register', loginController.register) //注册

const login_middleware = (req: any, res: any, next: any) => {
  console.log('登录中间件')
  next() //传递给下一步
}

// 登录参数校验账号密码中间件
const login_params = async (req: any, res: any, next: any) => {
  // 从请求体中获取用户名和密码
  let { username, password } = req.body
  console.log(username, password)

  // 检查用户名和密码是否为空
  if (!username || !password) {
    return res.status(400).json({
      message: '账号和密码不能为空'
    })
  }

  try {
    // 查询数据库，验证账号密码
    const user = (await mysql.query(loginService.verifyUser, [
      username,
      password
    ] as never[])) as any

    if (user.length === 0) {
      return res.status(401).json({
        message: '账号或密码不正确'
      })
    }

    // 验证通过，将用户信息添加到请求对象中
    req.user = user[0]
    next()
  } catch (error) {
    console.error('验证失败:', error)
    res.status(500).json({
      message: '服务器错误，请稍后重试'
    })
  }
}

router.post('/login', [login_middleware, login_params], loginController.login)

module.exports = router
