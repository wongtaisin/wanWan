import express from 'express' // 引入express模块
import paymentController from '../controllers/paymentController'
const router = express.Router() //模块化路由

// 查询支付列表
router.get('/all', paymentController.all)

export default router
