import { expressjwt } from 'express-jwt'

// 验证token是否过期
const jwtAuth = expressjwt({
  secret: process.env.JWT_SECRET || 'wongtaisin', // 密匙
  algorithms: ['HS256'] // 签名算法
}).unless({ path: ['/api/login/signIn', '/api/login/signUp'] }) // unless 设置jwt认证白名单

export default jwtAuth
