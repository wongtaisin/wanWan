import express from 'express' // 引入express模块
import { skipOperationLog } from '../middleware/operationLog' // 跳过接口的日志记录
const commonController = require('../controllers/commonController')
const upload = require('../util/upload')
const router = express.Router() //模块化路由

// 上传文件
router.post('/common/upload', upload, commonController.uploadFile)

// 地区数据接口 - 添加跳过日志记录
router.get('/common/areaData', skipOperationLog(), commonController.getAreaData)

module.exports = router
