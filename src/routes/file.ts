import express from 'express' // 引入express模块
import fileController from '../controllers/fileController'
const router = express.Router() //模块化路由

router.post('/base/upload', fileController.uploadFile)

router.delete('/base/file/:id', fileController.deleteFile)

export default router
