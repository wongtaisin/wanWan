// 使用mysql2模块代替mysql以支持新的认证协议
import mysql from 'mysql2'

const pool = mysql.createPool({
  connectionLimit: 10, //最大连接数，默认为10
  host: 'localhost', // 数据库服务器地址
  port: 3306, //数据库端口
  user: 'root', // 数据库的用户名
  password: '75440055', // 数据库密码
  database: 'test_express', // 数据库名
  // 配置认证插件
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('75440055')
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
            reject(err)
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
