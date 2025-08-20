var { expressjwt: jwt } = require('express-jwt')

// 验证token是否过期
const jwtAuth = jwt({
  secret: 'caowj', //密匙
  algorithms: ['HS256'] //签名算法
}).unless({ path: ['/api/login', '/api/register'] }) // unless 设置jwt认证白名单

module.exports = jwtAuth
