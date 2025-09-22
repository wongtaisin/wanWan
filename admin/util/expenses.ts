import mysql from '../db/mysql'
import _util from '../util/util'
const expensesService = require('../service/expensesService')

// 执行查询获取花销列表
const list = (userId: number, params: never[]): Promise<unknown> => {
  return new Promise(async (resolve, reject): Promise<void> => {
    try {
      const data: any = await mysql.query(expensesService.expensesById(userId), params)

      data.forEach((item: any) => {
        item.create_date = _util.formatDate(item.create_date, 'yyyy-MM-dd')
      })
      resolve(data)
    } catch (error) {
      console.error('格式化日期失败:', error)
      reject(error)
    }
  })
}

export default { list }
