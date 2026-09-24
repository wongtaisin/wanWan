/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-09-24 00:42:23
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-25 01:40:24
 * @FilePath: \wanWan\src\controllers\ledgerController.ts
 * @Description:
 *
 * Copyright (c) 2026 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../config/mysql'
import ledgerService from '../service/ledgerService'
import shopService from '../service/shopService'
import _util from '../util/util'

class LedgerController {
  /**
   * @desc 查询花销详情列表
   * @param {number} userId // 用户ID
   * @param {string} userName // 用户名，模糊查询
   * @param {string[]} expensesName // 花销名称
   * @param {string} startDate // 开始时间
   * @param {string} endDate // 结束时间
   * @param {number} page // 页码 必填
   * @param {number} pageSize // 每页数量 必填
   * @param {string} orderBy // 排序字段，默认 create_date
   * @param {string} sort // 排序方式，默认 DESC
   *
   */
  list = async (req: any, res: any, next: any) => {
    const { userName, ledgerName, type, startDate, endDate, page, pageSize, orderBy, sort } =
      req.body
    const userId = req.body.userId ?? req.auth.user_id

    const currentPage = Math.max(1, Number(page) || 1)
    const size = Math.max(1, Math.min(200, Number(pageSize) || 10))
    const offset = (currentPage - 1) * size

    const result = await ledgerService.queryLedgerList({
      userId,
      userName,
      ledgerName,
      type,
      startDate,
      endDate,
      limit: size,
      offset,
      orderBy,
      sort
    })

    res.json({
      code: 200,
      data: {
        list: result.list,
        total: result.total,
        page: currentPage,
        pageSize: size
      },
      message: '查询成功'
    })
  }

  /**
   * @desc 添加花销
   * @param {number} userId // 必填
   * @param {string} ledger_name // 名称 必填
   * @param {string} payment_id // 支付方式id
   * @param {string} payment_name // 支付方式
   * @param {string} money // 金额
   * @param {string} remark // 备注
   * @param {string} image // 图片
   * @param {string} shop_id // 店铺id，有值是用户存储的店铺
   * @param {string} shop_name // TODO: 店铺（1,调用高德地图获取; 2,可使用用户存储的店铺）
   * @param {string} province // 省份
   * @param {string} city // 城市
   * @param {string} area // 区县
   * @param {string} address // 地址
   * @param {string} create_date // 创建时间
   *
   */
  add = async (req: any, res: any, next: any) => {
    const {
      type,
      ledgerName,
      paymentId,
      paymentName,
      money,
      shopId,
      // shopName,
      remark,
      image,
      // province,
      // city,
      // area,
      // address,
      createDate
    } = req.body

    const { user_id, user_name } = req.auth

    let shopParams: {
      shop_name: string
      province: string
      city: string
      area: string
      address: string
    } = {
      shop_name: req.body.shopName, // 店铺名称
      province: req.body.province, // 省份
      city: req.body.city, // 城市
      area: req.body.area, // 区县
      address: req.body.address // 地址
    } // 店铺地址参数

    // 检查店铺是否存在，存在则更新地址信息
    if (!!shopId) {
      const shopResult: any = await mysql.query(shopService.checkShopUserId, [
        user_id,
        shopId
      ] as never[])
      const { shop_name, province, city, area, address } = shopResult[0]
      shopParams = { shop_name, province, city, area, address }
    }

    const createTime = !createDate
      ? _util.formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss')
      : createDate

    // 检查该字段时间段是否已存在
    const checkResult: any = await mysql.query(ledgerService.checkTimeByFieldNameLedger(), [
      user_id,
      createTime,
      ledgerName
    ] as never[])

    if (checkResult.length > 0) {
      return res.json({
        code: 400,
        data: checkResult[0],
        message: `该字段时间段已存在`
      })
    }

    const params = [
      user_id,
      user_name,
      type,
      ledgerName,
      money,
      paymentId,
      paymentName,
      shopId,
      shopParams.shop_name,
      remark,
      image,
      shopParams.province,
      shopParams.city,
      shopParams.area,
      shopParams.address,
      createDate
    ] as never[]
    const result: any = await mysql.query(ledgerService.add, params)

    res.json({
      code: 200,
      data: {
        id: result.insertId,
        userId: req.auth.user_id,
        type,
        ledgerName,
        money,
        // [ledgerName]: money,
        paymentName,
        shopName: shopParams.shop_name,
        remark,
        image,
        province: shopParams.province,
        city: shopParams.city,
        area: shopParams.area,
        address: shopParams.address,
        createDate: createTime
      },
      message: '添加成功'
    })
  }

  /**
   * @desc 更新花销
   * @param {number} id // 必填
   * @param {string} ledger_name // 名称 必填
   * @param {string} payment_id // 支付方式id
   * @param {string} payment_name // 支付方式
   * @param {string} money // 金额
   * @param {string} remark // 备注
   * @param {string} image // 图片
   * @param {string} shop_id // 店铺id，有值是用户存储的店铺
   * @param {string} shop_name // TODO: 1-店铺（调用高德地图，获取），2-可用户自己新增
   * @param {string} province // 省份
   * @param {string} city // 城市
   * @param {string} area // 区县
   * @param {string} address // 地址
   */
  upDate = async (req: any, res: any, next: any) => {
    let {
      id,
      ledgerName,
      paymentId,
      paymentName,
      money,
      shopId,
      // shopName,
      remark,
      image
      // province,
      // city,
      // area,
      // address
    } = req.body

    let shopParams: {
      shopName: string
      province: string | null
      city: string | null
      area: string | null
      address: string | null
    } = {
      shopName: req.body.shopName, // 店铺名称
      province: req.body.province, // 省份
      city: req.body.city, // 城市
      area: req.body.area, // 区县
      address: req.body.address // 地址
    } // 店铺地址参数

    const getInfo: any = await mysql.query(ledgerService.checkId, [id] as never[])

    const { user_id: userId, type } = getInfo[0]

    if (!shopId) {
      // 不存在则删除数据库之前存的地址信息
      shopParams = {
        shopName: req.body.shopName,
        province: null,
        city: null,
        area: null,
        address: null
      }
    } else {
      // 存在则更新地址信息
      const shopResult: any = await mysql.query(shopService.checkShopUserId, [
        userId,
        shopId
      ] as never[])
      const { shop_name: shopName, province, city, area, address } = shopResult[0]
      shopParams = { shopName, province, city, area, address }
    }

    const params = [
      ledgerName,
      money,
      paymentId,
      paymentName,
      shopId,
      shopParams.shopName,
      remark,
      image,
      shopParams.province,
      shopParams.city,
      shopParams.area,
      shopParams.address,
      id
    ] as never[]
    await mysql.query(ledgerService.update, params)

    res.json({
      code: 200,
      data: {
        id,
        userId,
        type,
        ledgerName,
        money,
        paymentName,
        ...shopParams,
        remark,
        image,
        updateDate: _util.formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss')
      },
      message: '更新成功'
    })
  }

  /**
   * @desc 删除花销
   * @param {number} id // 必填
   */
  delete = async (req: any, res: any, next: any) => {
    const { id }: { id: number } = req.params

    const getInfo: any = await mysql.query(ledgerService.checkId, [id] as never[])

    if (getInfo.length < 1) {
      return res.json({
        code: 400,
        message: '没有数据'
      })
    }

    // 删除 deleteExpenses 的 id 数据
    await mysql.query(ledgerService.deleteId, [id] as never[])

    res.json({
      code: 200,
      message: '删除成功'
    })
  }

  checkDatePrice = async (req: any, res: any, next: any) => {
    const { startDate, endDate, type } = req.query

    const checkDateRangeResult: any = await mysql.query(ledgerService.checkDateRange, [
      req.auth.user_id,
      startDate,
      endDate
    ] as never[])

    let ledgerName = [] as string[]

    if (type === '1') {
      ledgerName = [
        '吃',
        '喝',
        '玩',
        '乐',
        '过路费',
        '油费',
        '停车费',
        '交通费',
        '超市',
        '网购',
        '话费',
        '红包',
        'vip',
        '其它'
      ]
    } else {
      ledgerName = ['新澳', '红包', '兼职']
    }

    // 按 ledger_name 分组并计算合计
    const sum: Record<string, number> = {}
    const monthMap: Record<string, Record<string, number>> = {}
    checkDateRangeResult.forEach((item: any) => {
      if (ledgerName.includes(item.ledger_name)) {
        const key = item.ledger_name
        const money = Number(item.money) || 0
        sum[key] = _util.formatNumber((sum[key] || 0) + money)

        // 计算月份合计
        const monthKey = _util.formatDate(item.create_date, 'yyyy-MM')
        if (!monthMap[monthKey]) monthMap[monthKey] = {} // 初始化月份合计对象
        monthMap[monthKey][key] = _util.formatNumber((monthMap[monthKey][key] || 0) + money) // 累加当前月份当前支出类型的金额
      }
    })

    // 计算每个月份的总支出
    for (const monthKey in monthMap) {
      const monthData = monthMap[monthKey]
      monthData.total = Object.values(monthData).reduce((acc: number, value: string | number) => {
        return acc + Number(value)
      }, 0)
      monthData.total = _util.formatNumber(monthData.total)
    }

    const total = Object.keys(sum).reduce((acc: number, key: string) => {
      return acc + Number(sum[key])
    }, 0)

    const dayMap: Record<string, Record<string, number>> = {}

    checkDateRangeResult.forEach((item: any) => {
      if (ledgerName.includes(item.ledger_name)) {
        const key = item.ledger_name
        const money = Number(item.money) || 0
        sum[key] = _util.formatNumber((sum[key] || 0) + money)

        // 计算日期合计
        const dayKey = _util.formatDate(item.create_date, 'yyyy-MM-dd')
        if (!dayMap[dayKey]) dayMap[dayKey] = {} // 初始化日期合计对象
        dayMap[dayKey][key] = _util.formatNumber((dayMap[dayKey][key] || 0) + money) // 累加当前日期当前支出类型的金额
      }
    })

    // 计算每个日期的总支出
    for (const dayKey in dayMap) {
      const dayData = dayMap[dayKey]
      dayData.total = Object.values(dayData).reduce((acc: number, value: string | number) => {
        return acc + Number(value)
      }, 0)
      dayData.total = _util.formatNumber(dayData.total)
    }

    res.json({
      code: 200,
      data: {
        dayMap,
        monthMap,
        sum,
        total: _util.formatNumber(total)
      },
      message: '查询成功'
    })
  }
}
export default new LedgerController()
