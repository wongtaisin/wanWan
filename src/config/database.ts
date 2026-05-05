import { Sequelize } from 'sequelize'
import './loadEnv' // 首先加载环境变量

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'expenses_db',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '12345678',
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
    console.log(`[sequelize] connect success, IP: ${process.env.MYSQL_HOST} 🟢`)
  } catch (error) {
    console.error(`[sequelize] connect error: ${error} 🔴`)
  }
}

testConnection()

export default sequelize
