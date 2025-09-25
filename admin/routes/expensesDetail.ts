import express from 'express' // 引入express模块
const controller = require('../controllers/expensesDetailController')
const router = express.Router() //模块化路由

// 添加花销
router.post('/expensesDetail/add', controller.add)

router.post('/expensesDetail/edit', controller.upDate)

module.exports = router
