/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2026-09-21 02:05:18
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-21 02:42:24
 * @FilePath: \wanWan\src\controllers\earnnController.ts
 * @Description: 收入控制器
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import mysql from '../config/mysql'
import earnService from '../service/eranService'
import { ReSuccess } from '../util/response'

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
      create_date
    } = req.body

    const createDate = create_date || new Date().toISOString().split('T')[0]

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
      createDate
    ] as never[])

    ReSuccess(res, 200, '添加成功', {
      id: result.insertId,
      userId: req.auth.user_id,
      date: createDate
    })
  }
}

export default new earnController()
