// 使用mysql2模块代替mysql以支持新的认证协议
import mysql from 'mysql2'

const mysqlPassword = process.env.MYSQL_PASSWORD || '75440055'

const pool = mysql.createPool({
  connectionLimit: Number(process.env.MYSQL_POOL_LIMIT) || 10, // 最大连接数
  host: process.env.MYSQL_HOST || 'localhost', // 数据库服务器地址
  port: Number(process.env.MYSQL_PORT) || 3306, // 数据库端口
  user: process.env.MYSQL_USER || 'root', // 数据库用户名
  password: mysqlPassword, // 数据库密码
  database: process.env.MYSQL_DATABASE || 'test_express', // 数据库名
  // 配置认证插件
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(mysqlPassword)
  }
})

class Mysql {
  constructor() {}
  query(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err)
          throw err // not connected!
        }
        connection.query(sql, params, function (error, results, fields) {
          if (error) {
            reject(error)
            throw error
          }
          connection.release() //只是释放链接，在缓冲池，没有被销毁
          resolve(results)
        })
      })
    })
  }
}

export default new Mysql()
