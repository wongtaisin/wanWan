const express = require('express')
const userController = require('../controllers/userController')
const upload = require('../util/upload')

const router = express.Router()

router.get('/list', userController.list)

router.delete('/user', userController.deleteUser)

router.post('/upload', upload, (req, res, next) => {
  // 存储后的文件信息在 req.file 中，此时文件已经存储到本地了。
  console.log(req.file)
  res.send('success')
})

router.get('/user/json', userController.getUser)

module.exports = router
