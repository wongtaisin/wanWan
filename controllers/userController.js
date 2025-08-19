// 引入mysql模块
const mysql = require('../db/mysql')
// 引入userService模块
const userService = require('../service/userService')

// 获取用户列表
exports.list = function (req, res) {
  res.json({
    //发送json数据类型
    list: [
      {
        name: '12',
        id: 1
      },
      {
        name: '1233',
        id: 2
      }
    ]
  })
}

// 删除用户
exports.deleteUser = function (req, res) {
  res.send('Got a DELETE request at /user') //发送各种类型的响应
}

// 获取用户列表
exports.getUser = function (req, res) {
  mysql.query(userService.userAll).then(data => {
    let jsonData = JSON.parse(JSON.stringify(data))
    res.json({
      data: jsonData
    })
  })
}
