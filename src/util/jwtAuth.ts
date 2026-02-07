import auth from './auth'
import jwtVerify from './jwt'

const jwtAuth = [jwtVerify, auth] // 组合jwt认证中间件和auth中间件

export default jwtAuth
