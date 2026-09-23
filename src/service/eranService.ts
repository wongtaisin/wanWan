/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-09-23 09:47:03
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-23 23:20:09
 * @FilePath: \wanWan\src\service\eranService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */

class EarnService {
  /**
   * @desc 添加
   * @param {string} user_id 用户id
   * @param {string} user_name 用户名
   * @param {string} earn_name 收入名称 必填
   * @param {number} money 收入金额 必填
   * @param {number} payment_id 支付方式id
   * @param {number} shop_id 店铺id
   * @param {string} shop_name 店铺
   * @param {string} remark 备注
   * @param {string} image 图片base64编码
   * @param {string} province 省份
   * @param {string} city 城市
   * @param {string} area 区县
   * @param {string} address 详细地址
   * @param {string} create_date 收入日期
   * @example [user_id, user_name, earn_name, money, payment_id, shop_id, shop_name, remark, image, province, city, area, address, create_date]
   * @demo [1, '大帅', '工资', '15000', 1, 1, '店铺', '备注', '图片base64编码', '省份', '城市', '区县', '详细地址', '2025-09-01 10:10:10']
   *
   * @explain COALESCE(NULLIF(?, ''), now()) 当 create_date 为空时，使用当前时间
   */
  add = `INSERT INTO earn (user_id, user_name, earn_name, money, payment_id, shop_id, shop_name, remark, image, province, city, area, address, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(NULLIF(?, ''), now()))`

  checkDateRange = `
  SELECT *,
    DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date,
    DATE_FORMAT(update_date, '%Y-%m-%d %H:%i:%s') AS update_date
  FROM earn
  WHERE user_id = ?
    AND DATE(create_date) BETWEEN IFNULL(?, DATE(create_date)) AND IFNULL(?, DATE(create_date))
  ORDER BY create_date DESC
`
}

export default new EarnService()
