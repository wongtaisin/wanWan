/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 09:47:03
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-22 16:51:23
 * @FilePath: \wanWan\service\expensesDetailService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

class ExpensesDetailService {
  // 查询所有
  getIdExpensesDetail = `SELECT *, DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date FROM expenses_detail WHERE 1=1 AND id = ?`

  /**
   * @desc 添加
   * @param {string} user_id 用户id
   * @param {string} user_name 用户名
   * @param {string} expenses_name 花销名称 必填
   * @param {number} money 花销金额 必填
   * @param {number} payment_id 支付方式id
   * @param {string} payment_name 支付方式
   * @param {number} shop_id 店铺id
   * @param {string} shop_name 店铺
   * @param {string} remark 备注
   * @param {string} image 图片base64编码
   * @param {string} province 省份
   * @param {string} city 城市
   * @param {string} area 区县
   * @param {string} address 详细地址
   * @param {string} create_date 花销日期
   * @example [user_id, user_name, expenses_name, money, payment_name, shop_name, remark, image, province, city, area, address, create_date]
   * @demo [1, '大帅', 'eat', 15, '现金', '店铺', '备注', '图片base64编码', '省份', '城市', '区县', '详细地址', '2025-09-01 10:10:10']
   *
   * @explain COALESCE(NULLIF(?, ''), now()) 当 create_date 为空时，使用当前时间
   */
  add = `INSERT INTO expenses_detail (user_id, user_name, expenses_name, money, payment_id, payment_name, shop_id, shop_name, remark, image, province, city, area, address, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`

  /**
   * @desc 根据 id 更新，其它参数不传时，直接使用数据库里的值
   * @param {number} id 花销详情id 必填
   * @param {string} expenses_name 花销名称 必填
   * @param {number} money 花销金额
   * @param {number} payment_id 支付方式id
   * @param {string} payment_name 支付方式
   * @param {number} shop_id 店铺id
   * @param {string} shop_name 店铺
   * @param {string} remark 备注
   * @param {string} image 图片base64编码
   * @param {string} province 省份
   * @param {string} city 城市
   * @param {string} area 区县
   * @param {string} address 详细地址
   * @param {string} update_date 更新时间 now() 自动更新
   * @example [expenses_name, money, payment_id, payment_name, shop_id, shop_name, remark, image, province, city, area, address, update_date, id]
   * @demo ['eat', 15, 1, '现金', 1, '店铺', '备注', '图片base64编码', '省份', '城市', '区县', '详细地址', '2025-09-01 10:10:10', 1]
   *
   * @explain COALESCE() 用于从参数列表中返回第一个非NULL值，至少需两个参数，遇到第一个非NULL参数后停止后续计算
   * @explain COALESCE(NULLIF(?, ''), now()) 当 update_date 为空时，使用当前时间
   * @explain COALESCE(?, money) 当 money 为空时，使用数据库里的值
   */
  updateExpensesDetail = `UPDATE expenses_detail SET expenses_name = ?, money = COALESCE(?, money), payment_id = COALESCE(?, payment_id), payment_name = COALESCE(?, payment_name), shop_id = ?, shop_name = ?, remark = COALESCE(?, remark), image = COALESCE(?, image), province = ?, city = ?, area = ?, address = ?, update_date = NOW() WHERE id = ?`

  // 根据 id 删除
  deleteExpensesDetailId = `DELETE FROM expenses_detail WHERE id = ?`

  // 删除所有
  deleteExpensesDetailAll = `DELETE FROM expenses_detail`

  /**
   * @desc 检查指定日期是否存在
   * @param {number} user_id 用户id
   * @param {string} create_date 花销日期
   * @param {string} expenses_name 花销名称
   * @example [id, create_date, expenses_name]
   * @demo [1, 2025-09-01 10:10:10, 'eat']
   *
   * @explain DATE(create_date) = DATE(?)
      ? = '2025-09-23'，能匹配 2025-09-23 00:00:00 ~ 2025-09-23 23:59:59；
      ? = '2025-09-23 12:30:00'，也能匹配到当天的数据
   */
  checkTimeByFieldNameExpensesDetail = (type: string = 'YYMMDD hh:mm:ss') => {
    let date = ''
    switch (type) {
      case 'YYMMDD hh:mm:ss':
        date = `AND create_date = ?`
        break
      default:
        date = `AND DATE(create_date) = DATE(?)`
        break
    }
    return `SELECT * FROM expenses_detail WHERE user_id = ? ${date} AND expenses_name = ?`
  }

  /**
   * @desc 根据 id 删除花销详情
   * @param {number} id 花销详情id
   * @example [id]
   * @demo [1]
   */
  deleteExpensesDetail = `DELETE FROM expenses_detail WHERE id = ?;`

  /**
   * @desc 查询 expenses_detail 表中与 expenses 表不一致的数据
   * @returns {object} { sql: string, params: any[] }
   * @example { sql: 'SELECT ed.* FROM expenses_detail ed LEFT JOIN (SELECT DISTINCT user_id, DATE(create_date) AS d FROM expenses) e ON ed.user_id = e.user_id AND DATE(ed.create_date) = e.d WHERE e.d IS NULL ORDER BY ed.user_id, ed.create_date;', params: [] }
   *
   * @explain LEFT JOIN // 左连接，返回左表中的所有记录，右表中匹配的记录如果不存在，也会返回 NULL
   * @explain DISTINCT // 用于返回唯一不同的值
   * @explain DATE() // DATE(create_date) 是将 create_date 转换为日期格式
   * @explain IS NULL // 用于查询字段值为 NULL 的记录
   * @explain ORDER BY // 用于对结果集进行排序
   */
  contrastDate = `SELECT ed.*
FROM expenses_detail ed
LEFT JOIN (
  SELECT DISTINCT user_id, DATE(create_date) AS d
  FROM expenses
) e
  ON ed.user_id = e.user_id
 AND DATE(ed.create_date) = e.d
WHERE e.d IS NULL
ORDER BY ed.user_id, ed.create_date;
`

  /**
   * @desc 检查指定日期是否存在
   * @param {number} userId 用户id
   * @param {string} startDate 开始日期
   * @param {string} endDate 结束日期
   * @example [userId, startDate, endDate]
   * @demo [1, 2025-01-31, 2025-12-31]
   *
   */
  /**
   * @desc 根据用户ID与日期范围查询花销明细
   * @param {number} userId 用户id
   * @param {string} startDate 开始日期（YYYY-MM-DD）
   * @param {string} endDate 结束日期（YYYY-MM-DD）
   * @example [userId, startDate, endDate]
   * @demo [1, '2025-01-01', '2025-12-31']
   *
   * @explain 使用 DATE(create_date) 提取日期部分，避免时间干扰；IFNULL 处理空参数，保持查询兼容
   */
  checkDateRange = `
  SELECT *,
    DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date,
    DATE_FORMAT(update_date, '%Y-%m-%d %H:%i:%s') AS update_date
  FROM expenses_detail
  WHERE user_id = ?
    AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date)) AND IFNULL(?, DATE(create_date))
  ORDER BY create_date DESC
`
}

export default new ExpensesDetailService()
