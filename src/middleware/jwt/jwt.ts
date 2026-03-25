import { expressjwt } from 'express-jwt'

const whiteList = ['/api/login/signIn', '/api/login/signUp']

// 验证token是否过期
const jwtAuth = expressjwt({
  secret: process.env.JWT_SECRET || 'wongtaisin1024@gmail.com', // 密匙
  algorithms: ['HS256'] // 签名算法
}).unless({ path: whiteList }) // unless 设置jwt认证白名单

export default jwtAuth
