import express from 'express' // 引入express模块
import earnController from '../controllers/earnController'
const router = express.Router() //模块化路由

// 添加收入
router.post('/add', earnController.add)

export default router
