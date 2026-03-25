/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-11 08:22:31
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-03-25 09:33:19
 * @FilePath: \wanWan\src\config\mysql.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
// 使用mysql2模块代替mysql以支持新的认证协议
import mysql from 'mysql2'

const mysqlPassword = process.env.MYSQL_PASSWORD || '75440055'

const pool = mysql.createPool({
  connectionLimit: Number(process.env.MYSQL_POOL_LIMIT) || 10, // 最大连接数
  host: process.env.MYSQL_HOST || 'localhost', // 数据库服务器地址
  port: Number(process.env.MYSQL_PORT) || 3306, // 数据库端口
  user: process.env.MYSQL_USER || 'root', // 数据库用户名
  password: mysqlPassword, // 数据库密码
  database: process.env.MYSQL_DATABASE || 'express', // 数据库名
  // 配置认证插件
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(mysqlPassword)
  }
})

// 添加连接池事件监听器，用于日志记录
// pool.on('connection', connection => {
//   console.log(
//     `[MySQL] 新连接建立: ${connection.threadId}, 主机: ${process.env.MYSQL_HOST || 'localhost'}`
//   )
// })

// pool.on('acquire', connection => {
//   console.log(`[MySQL] 连接被获取: ${connection.threadId}`)
// })

// pool.on('release', connection => {
//   console.log(`[MySQL] 连接被释放: ${connection.threadId}`)
// })

// pool.on('enqueue', () => {
//   console.log('[MySQL] 请求排队等待连接')
// })

// 测试连接
pool.getConnection((err, connection) => {
  if (err) {
    console.error(`[MySQL] 连接失败: ${err.message} 🔴`, {
      error: err.message,
      code: (err as any).code,
      errno: (err as any).errno,
      sqlMessage: (err as any).sqlMessage,
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      database: process.env.MYSQL_DATABASE || 'expenses'
    })
    return
  }

  console.log(`[MySQL] 连接成功: ${connection.threadId}, 主机: ${process.env.MYSQL_HOST} 🟢`)
  connection.release()
})

class Mysql {
  constructor() {}
  query(sql: string, params = []) {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.error(`[MySQL] 获取连接失败: ${err.message} 🔴`, {
            error: err.message,
            code: (err as any).code,
            errno: (err as any).errno,
            sqlMessage: (err as any).sqlMessage,
            host: process.env.MYSQL_HOST || 'localhost'
          })
          reject(err)
          throw err // not connected!
        }
        connection.query(sql, params, function (error, results, fields) {
          if (error) {
            console.error(`[MySQL] 查询执行失败: ${error.message} 🔴`, {
              sql: sql,
              params: params,
              error: error.message,
              code: (error as any).code,
              errno: (error as any).errno,
              sqlState: (error as any).sqlState,
              sqlMessage: (error as any).sqlMessage
            })
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
