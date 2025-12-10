/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-21 11:41:42
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-12-03 14:25:46
 * @FilePath: \wanWan\controllers\loginController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import jwt from 'jsonwebtoken'

class LoginController {
  // 注册用户
  async register(req: any, res: any) {
    try {
      let { userName, phone, userId } = req.userInfo

      res.status(201).json({
        code: 201,
        data: {
          userId,
          userName,
          phone,
          message: '注册成功'
        }
      })
    } catch (error) {
      console.error('注册失败:', error)
      res.status(500).json({ message: '注册失败，请稍后重试' })
    }
  }

  // 登录
  login = async (req: any, res: any) => {
    let { user_id, user_name, phone } = req.user

    // 登录成功，签发一个token并返回给前端
    const token = jwt.sign(
      // payload：签发的 token 里面要包含的一些数据
      { user_id, user_name, phone },
      // 私钥
      'wongtaisin',
      // 设置过期时间
      { expiresIn: 60 * 60 * 24 } //1 day
    )

    res.status(200).json({
      code: 200,
      data: { token },
      message: '登录成功'
    })
  }
}

export default new LoginController()
