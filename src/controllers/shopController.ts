/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-24 15:11:26
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-13 10:46:38
 * @FilePath: \wanWan\controllers\shopController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../config/mysql'
import shopService from '../service/shopService'

class ShopController {
  /**
   * @desc 添加店铺
   * @param {string} shopName 店铺名称 必填
   * @param {string} provinceCode 省份编码
   * @param {string} province 省份
   * @param {string} city 城市
   * @param {string} areaCode 区县编码
   * @param {string} area 区县
   * @param {string} address 详细地址
   * @param {string[]} images 图片base64编码，多个图片用逗号隔开
   * @example [shop_name, provinceCode, province, cityCode, city, areaCode, area, address, images]
   * @demo ['店铺', '省份编码', '省份', '城市编码', '城市', '区县编码', '区县', '详细地址', '图片base64编码']
   *
   */
  add = async (req: any, res: any, next: any) => {
    const {
      shopName,
      provinceCode,
      province,
      cityCode,
      city,
      areaCode,
      area,
      address,
      images,
      remark
    } = req.body

    // 验证参数是否为空
    if (!shopName) {
      return res.json({
        code: 400,
        message: '店铺名称不能为空'
      })
    }

    const { user_id } = req.auth
    const result: any = await mysql.query(shopService.addShop, [
      user_id,
      shopName,
      provinceCode,
      province,
      cityCode,
      city,
      areaCode,
      area,
      address,
      images,
      remark
    ] as never[])

    res.json({
      code: 200,
      data: {
        id: result.insertId,
        userId: user_id,
        shopName,
        province,
        city,
        area,
        address,
        images,
        remark,
        createDate: new Date()
      },
      message: '添加成功'
    })
  }

  edit = async (req: any, res: any, next: any) => {
    const {
      id,
      shopName,
      provinceCode,
      province,
      cityCode,
      city,
      areaCode,
      area,
      address,
      images,
      remark
    } = req.body

    // 验证参数是否为空
    if (!shopName) {
      return res.json({
        code: 400,
        message: '店铺名称不能为空'
      })
    }

    try {
      const result: any = await mysql.query(shopService.editShop, [
        shopName,
        provinceCode,
        province,
        cityCode,
        city,
        areaCode,
        area,
        address,
        images,
        remark,
        id
      ] as never[])

      res.json({
        code: 200,
        data: result,
        message: '更新成功'
      })
    } catch (error) {
      res.json({
        code: 500,
        message: '更新失败'
      })
    }
  }

  all = async (req: any, res: any, next: any) => {
    const result = await mysql.query(shopService.shopAll, [])

    res.json({
      code: 200,
      data: result,
      message: '查询成功'
    })
  }

  /**
   * @desc 查询用户店铺列表
   * @param {string} userId 用户ID，默认当前用户
   * @param {number} page 页码，默认第一页
   * @param {number} pageSize 每页数量，默认10条，最大200条
   * @example [userId, page, pageSize]
   * @demo [1, 1, 10]
   *
   */
  list = async (req: any, res: any, next: any) => {
    const { page, pageSize } = req.body

    const currentPage = Math.max(1, Number(page) || 1) // 当前页码，默认第一页
    const limit = Math.max(1, Math.min(200, Number(pageSize))) // 每页数量，默认10条，最大200条
    const offset = (currentPage - 1) * limit // 偏移量，用于分页查询

    const userId = req.query?.userId ?? req.auth.user_id

    const result = await mysql.query(shopService.getUserIdShop, [userId, limit, offset] as never[])

    const totalResult: any = await mysql.query(shopService.shopAll, [])

    res.json({
      code: 200,
      data: {
        list: result,
        total: totalResult.length,
        page: currentPage,
        pageSize: limit
      },
      message: '查询店铺成功'
    })
  }

  delete = async (req: any, res: any, next: any) => {
    const { id }: { id: number } = req.params

    try {
      await mysql.query(shopService.deleteShopId, [id] as never[])

      res.json({
        code: 200,
        message: '删除成功'
      })
    } catch (error) {
      res.json({
        code: 500,
        message: '删除失败'
      })
    }
  }
}
export default new ShopController()
