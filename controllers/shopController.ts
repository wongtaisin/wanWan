/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-24 15:11:26
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-10-24 17:11:44
 * @FilePath: \wanWan\controllers\shopController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
const shopService = require('../service/shopService')
import mysql from '../db/mysql'

/**
 * @desc 添加商店
 * @param {string} shopName 店铺名称 必填
 * @param {string} province 省份
 * @param {string} city 城市
 * @param {string} area 区县
 * @param {string} address 详细地址
 * @param {string[]} images 图片base64编码，多个图片用逗号隔开
 * @example [shop_name, province, city, area, address, images]
 * @demo ['店铺', '省份', '城市', '区县', '详细地址', '图片base64编码']
 *
 */
exports.add = async (req: any, res: any, next: any) => {
  let { shopName, province, city, area, address, images } = req.body

  const params = [shopName, province, city, area, address, images]

  const result: any = await mysql.query(shopService.addShop, params as never[])

  res.json({
    code: 200,
    data: {
      id: result.insertId,
      userId: req.auth.user_id,
      shopName,
      province,
      city,
      area,
      address,
      createDate: new Date()
    },
    message: '添加成功'
  })
}
