import dotenv from 'dotenv'

// 立即加载环境变量
const envPath = `.env.${process.env.NODE_ENV || 'development'}`
dotenv.config({ path: envPath })

export { envPath }
