const express = require('express')
const path = require('path')
const bodyParser = require('body-parser') // 引入body-parser模块
const cors = require('cors')
const routes = require('./routes')
const { autoOperationLogMiddleware } = require('./middleware/operationLog') // 引入操作日志中间件
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true })) // 解析form表单提交的数据application/x-www-form-urlencoded
app.use(bodyParser.json()) // 解析json数据格式
app.use(bodyParser.text()) //解析 text/plain 数据格式

app.use(cors()) // 注入cors模块解决跨域

// 在所有路由之前注入自动日志记录中间件
app.use(autoOperationLogMiddleware())

app.use('/', routes)

app.listen(3001, () => {
  console.log('server is running port')
})
