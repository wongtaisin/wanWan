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
exports.deleteUser = async (req, res) => {
  const { id } = req.params

  // 检查用户是否存在
  const user = await mysql.query(userService.getUserById, [id])
  if (user.length === 0) {
    return res.status(404).json({
      message: '用户不存在',
      id
    })
  }

  // 执行删除操作
  await mysql.query(userService.deleteUser, [id])
  res.status(200).json({
    message: '删除成功',
    id
  })
}

// 获取用户列表
exports.getUser = (req, res) => {
  mysql.query(userService.userAll).then(data => {
    let jsonData = JSON.parse(JSON.stringify(data))
    res.json({
      data: jsonData
    })
  })
}
