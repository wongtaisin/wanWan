import mysql from '../db/mysql'
const expensesDetailService = require('../service/expensesDetailService')

/**
 * @desc 获取 expenses_name 新的字段值，需 expenses_detail 数据库里已有值
 * @param {number} id 花销详情id
 * @param {string} date 创建日期
 * @param {string} name 花销字段
 * @param {string} num 金额
 * @returns {Promise<string>} 金额字符串 1,2,3,4,5
 *
 * @demo valuesResult(1, '2025-09-23 10:10:10', 'eat', '100')
 * @demo valuesResult(1, '2025-09-23', 'eat')
 */
const valuesResult = (
  id: number,
  date: string,
  name: string,
  num: string = ''
): Promise<string> => {
  return new Promise<string>(async (resolve, reject): Promise<void> => {
    try {
      // 检查该字段时间段是否已存在
      const checkResult = (await mysql.query(
        expensesDetailService.checkTimeByFieldNameExpensesDetail('YYMMDD'),
        [id, date, name] as never[]
      )) as any[]

      let result = [] as string[]

      if (checkResult.length > 0) {
        // 根据时间升序，往里面插入当前的金额
        checkResult.sort((a: any, b: any) => a.create_date - b.create_date)
        result = checkResult.map((item: any) => item.money)
      } else {
        result = [num] // 直接赋值
      }
      resolve(result.join(','))
    } catch (err) {
      reject(err)
    }
  })
}

export { valuesResult }
