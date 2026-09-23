/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-09-21 02:05:18
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-24 01:04:15
 * @FilePath: \wanWan\src\controllers\earnController.ts
 * @Description: 收入控制器
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../config/mysql'
import earnService from '../service/eranService'
import { ReSuccess } from '../util/response'
import _util from '../util/util'

class earnController {
  // 添加收入
  add = async (req: any, res: any, next: any) => {
    let {
      earnName,
      money,
      paymentId,
      shopId,
      shopName,
      remark,
      image,
      province,
      city,
      area,
      address,
      createDate
    } = req.body

    const dayDate = createDate || new Date().toISOString().split('T')[0]

    const result: any = await mysql.query(earnService.add, [
      req.auth.user_id,
      req.auth.user_name,
      earnName,
      money,
      paymentId,
      shopId,
      shopName,
      remark,
      image,
      province,
      city,
      area,
      address,
      dayDate
    ] as never[])

    ReSuccess(res, 200, '添加成功', {
      id: result.insertId,
      userId: req.auth.user_id,
      date: dayDate
    })
  }

  checkDatePrice = async (req: any, res: any, next: any) => {
    const { startDate, endDate } = req.query

    const result: any = await mysql.query(earnService.checkDateRange, [
      req.auth.user_id,
      startDate,
      endDate
    ] as never[])

    // TODO：收入名称，可sql查询全部取出
    const earnName = ['新澳', '红包', '兼职']

    // 按 earn_name 分组并计算合计
    const sum: Record<string, number> = {}

    result.forEach((item: any) => {
      if (earnName.includes(item.earn_name)) {
        const key = item.earn_name
        const money = Number(item.money) || 0
        sum[key] = _util.formatNumber((sum[key] || 0) + money)
      }
    })

    const total = Object.keys(sum).reduce((acc: number, key: string) => {
      return acc + Number(sum[key])
    }, 0)

    res.json({
      code: 200,
      data: {
        sum,
        total: _util.formatNumber(total)
      },
      message: '查询成功'
    })
  }
}

export default new earnController()
