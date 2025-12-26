import { Sequelize } from 'sequelize'
require('dotenv').config() // 确保在使用环境变量之前加载dotenv

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'expenses',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '75440055',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log, // 启用SQL日志
    pool: {
      max: 20, // 最大连接数
      min: 0, // 最小连接数
      acquire: 30000, // 获取连接的超时时间（毫秒）
      idle: 10000 // 空闲连接在 10 秒后自动释放
    }
  }
)

async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('sequelize数据库连接成功.')
  } catch (error) {
    console.error('sequelize数据库连接失败:', error)
  }
}

testConnection()

export default sequelize
