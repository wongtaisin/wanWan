import express from 'express' // 引入express模块
const userController = require('../controllers/userController')
const upload = require('../util/upload')
const router = express.Router()

router.delete('/deleteUser/:id', userController.deleteUser)

router.post('/upload', upload, (req: any, res: any, next: any) => {
  // 存储后的文件信息在 req.file 中，此时文件已经存储到本地了。
  console.log(req.file)
  res.send('success')
})

router.get('/user/list', userController.getUser)

module.exports = router
