import express from 'express' // 引入express模块
const commonController = require('../controllers/commonController')
const upload = require('../util/upload')
const router = express.Router() //模块化路由

// 上传文件
router.post('/common/upload', upload, commonController.uploadFile)

module.exports = router
