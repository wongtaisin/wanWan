/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-24 15:17:06
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-12 17:26:34
 * @FilePath: \wanWan\service\shopService.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
// 查询所有
export const getIdShop = `SELECT * FROM shop WHERE 1=1 AND id = ?`

/**
 * @desc 添加店铺
 * @param {number} user_id 用户id 必填
 * @param {string} shop_name 店铺名称 必填
 * @param {string} province_code 省份编码
 * @param {string} province 省份
 * @param {string} city_code 城市编码
 * @param {string} city 城市
 * @param {string} area_code 区县编码
 * @param {string} area 区县
 * @param {string} address 详细地址
 * @param {string[]} images 图片base64编码，多个图片用逗号隔开
 * @param {string} remark 备注
 * @example [shop_name, provinceCode, province, cityCode, city, areaCode, area, address, images, remark]
 * @demo ['店铺', '省份编码', '省份', '城市编码', '城市', '区县编码', '区县', '详细地址', '图片base64编码', '备注']
 *
 */
export const addShop = `INSERT INTO shop (user_id, shop_name, province_code, province, city_code, city, area_code, area, address, images, remark, create_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`

/**
 * @desc 根据 id 更新，其它参数不传时，直接使用数据库里的值
 * @param {number} id 花销详情id 必填
 * @param {string} shopName 店铺名称
 * @param {string[]} images 图片base64编码
 * @param {string} province_code 省份编码
 * @param {string} province 省份
 * @param {string} city_code 城市编码
 * @param {string} city 城市
 * @param {string} area_code 区县编码
 * @param {string} area 区县
 * @param {string} address 详细地址
 * @param {string} remark 备注
 * @param {string} update_date 更新时间 now() 自动更新
 * @example [shopName, provinceCode, province, cityCode, city, areaCode, area, address, images, remark, id]
 * @demo ['店铺', '省份编码', '省份', '城市编码', '城市', '区县编码', '区县', '详细地址', '图片base64编码', '备注', 1]
 *
 * @explain COALESCE() 用于从参数列表中返回第一个非NULL值，至少需两个参数，遇到第一个非NULL参数后停止后续计算
 * @explain COALESCE(NULLIF(?, ''), now()) 当 update_date 为空时，使用当前时间
 * @explain COALESCE(?, money) 当 money 为空时，使用数据库里的值
 */
export const editShop = `UPDATE shop SET shop_name = ?, province_code = COALESCE(?, province_code), province = COALESCE(?, province), city_code = COALESCE(?, city_code), city = COALESCE(?, city), area_code = COALESCE(?, area_code), area = COALESCE(?, area), address = COALESCE(?, address), images = COALESCE(?, images), remark = COALESCE(?, remark), update_date = NOW() WHERE id = ?`

/**
 * @desc 检查店铺名称是否存在
 * @param {string} shopName 店铺名称
 * @example [shop_name]
 * @demo ['店铺名称']
 *
 */
export const checkShopName = `SELECT * FROM shop WHERE shop_name = ?`

/**
 * @desc 根据 id 删除花销详情
 * @param {number} id 花销详情id
 * @example [id]
 * @demo [1]
 */
exports.deleteShopId = `DELETE FROM shop WHERE id = ?`

/**
 * @desc 查询所有店铺
 * @example []
 * @demo []
 *
 */
exports.shopAll = `SELECT * FROM shop`

/**
 * @desc 根据用户ID查询店铺
 * @param {number} user_id 用户ID
 * @param {number} id 店铺ID
 * @example [user_id, id]
 * @demo [1, 1]
 *
 */
export const checkShopUserId = `SELECT * FROM shop WHERE user_id = ? AND id = ?`

/**
 * @desc 根据用户ID查询店铺
 * @param {number} user_id 用户ID
 * @param {number} limit 每页数量
 * @param {number} offset 偏移量
 * @example [user_id, limit, offset]
 * @demo [1, 10, 0]
 *
 */
export const getUserIdShop = `SELECT *, DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date FROM shop WHERE 1=1 AND user_id = ? LIMIT ? OFFSET ?`
