import jwt from 'jsonwebtoken'

const whiteList = ['/api/login/signIn', '/api/login/signUp']
const JWT_SECRET = process.env.JWT_SECRET || 'wongtaisin1024@gmail.com'
const MAX_LOGIN_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days (ms)
const TOKEN_EXPIRY = 24 * 60 * 60 // 24 hours (s)
const REFRESH_THRESHOLD = 6 * 60 * 60 // 6 hours (s)

/**
 * 认证中间件
 * 1. 检查请求路径是否在白名单中，如果是，直接调用next()
 * 2. 从请求头中提取Authorization字段，判断是否存在token
 * 3. 如果不存在token，直接调用next()
 * 4. 如果存在token，解析token并验证是否过期
 * 5. 如果token过期时间在6小时内，刷新token
 * 6. 如果token未过期，将token中的loginAt设置为当前时间
 */
const auth = (req: any, res: any, next: any) => {
  if (whiteList.includes(req.path)) {
    return next()
  }

  const auth = req.auth
  if (!auth) {
    return next()
  }

  const nowMs = Date.now()
  const nowSec = Math.floor(nowMs / 1000)
  const loginAt =
    typeof auth.loginAt === 'number' ? auth.loginAt : auth.iat ? auth.iat * 1000 : nowMs

  /**
   * 验证token是否过期
   * 如果token过期时间超过7天，返回401错误
   */
  if (nowMs - loginAt > MAX_LOGIN_AGE) {
    return res.status(401).json({ code: 401, message: '登录已失效，请重新登录' })
  }

  /**
   * 如果token过期时间在6小时内，刷新token
   * 1. 从token中提取payload（不包含exp和iat）
   * 2. 设置新的登录时间为当前时间
   * 3. 签发新的token
   * 4. 设置新的token到Authorization头
   */
  if (typeof auth.exp === 'number' && auth.exp - nowSec < REFRESH_THRESHOLD) {
    const { exp, iat, ...payload } = auth
    payload.loginAt = loginAt

    const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
    res.setHeader('Authorization', 'Bearer ' + newToken)
  }

  req.auth = { ...auth, loginAt } // 更新token中的登录时间
  next()
}

export default auth
