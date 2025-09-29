/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-08-25 11:02:53
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-09-27 10:24:21
 * @FilePath: \admin\middleware\expenses.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
const expensesService = require('../service/expensesService')
import mysql from '../db/mysql'

/**
 * @desc 新增花销
 * @param {string} eat - 吃
 * @param {string} drink - 喝
 * @param {string} play - 玩
 * @param {string} glad - 乐
 * @param {string} tolls - 过路费
 * @param {string} oil - 油
 * @param {string} parking - 车
 * @param {string} traffic - 流量
 * @param {string} supermarket - 超市
 * @param {string} online_shopping - 网上购物
 * @param {string} phone_bill - 电话
 * @param {string} red_packet - 红包
 * @param {string} vip - 会员
 * @param {string} create_date - 时间
 * @returns {void}
 */
const add = async (req: any, res: any, next: any) => {
  try {
    let {
      eat,
      drink,
      play,
      glad,
      tolls,
      oil,
      parking,
      traffic,
      supermarket,
      online_shopping,
      phone_bill,
      red_packet,
      vip,
      create_date
    } = req.body

    let { user_id, user_name } = req.auth

    const params = [
      user_id,
      user_name,
      eat,
      drink,
      play,
      glad,
      tolls,
      oil,
      parking,
      traffic,
      supermarket,
      online_shopping,
      phone_bill,
      red_packet,
      vip,
      create_date
    ]

    // 验证通过，将用户信息添加到请求对象中
    req.addParams = params

    next()
  } catch (error) {
    console.error('验证失败:', error)
    res.status(500).json({
      message: '服务器错误，请稍后重试'
    })
  }
}

/**
 * @desc 更新花销
 * @param {string} eat - 吃
 * @param {string} drink - 喝
 * @param {string} play - 玩
 * @param {string} glad - 乐
 * @param {string} tolls - 过路费
 * @param {string} oil - 油
 * @param {string} parking - 车
 * @param {string} traffic - 流量
 * @param {string} supermarket - 超市
 * @param {string} online_shopping - 网上购物
 * @param {string} phone_bill - 电话
 * @param {string} red_packet - 红包
 * @param {string} vip - 会员
 * @param {string} create_date - 时间
 * @returns {void}
 */
const update = async (req: any, res: any, next: any) => {
  try {
    let { create_date } = req.body
    const createDate = create_date || new Date().toISOString().split('T')[0] // 当天的年月日
    const userId = req.auth.user_id

    const checkDate: any = await mysql.query(expensesService.checkDateByUserId, [
      createDate,
      userId
    ] as never[])

    // 日期已存在，执行更新合并操作
    if (checkDate.length > 0) {
      // return res.status(400).json({ message: '日期已存在' })
      const existingRecord = checkDate[0]
      const fields = [
        'eat',
        'drink',
        'play',
        'glad',
        'tolls',
        'oil',
        'parking',
        'traffic',
        'supermarket',
        'online_shopping',
        'phone_bill',
        'red_packet',
        'vip'
      ]

      const params: any = fields
        .map(
          field =>
            existingRecord[field] // 数据库里已有值
              ? req.body[field] // 如果本次请求有值
                ? `${existingRecord[field]},${req.body[field]}` // 追加
                : existingRecord[field] // 取旧值
              : req.body[field] // 没有旧值，直接取请求值
        )
        .concat(existingRecord.id) // 最后拼接 ID

      // 验证通过，将更新信息添加到请求对象中
      req.updateParams = params
      next()
    } else {
      // 这里继续调用next，是为了走新增的add
      next()
    }
  } catch (error) {
    console.error('验证失败:', error)
    res.status(500).json({
      message: '服务器错误，请稍后重试'
    })
  }
}

// 创建一个组合中间件来控制update和add的执行流程
const updateThenAddIfOk = async (req: any, res: any, next: any) => {
  try {
    // 先执行update中间件
    await new Promise<void>((resolve, reject) => {
      update(req, res, resolve)
    })

    // 如果update中间件成功执行并调用了next，就执行add中间件
    if (!req.updateParams) {
      await new Promise<void>((resolve, reject) => {
        add(req, res, resolve)
      })
    }

    // 继续到控制器
    next()
  } catch (error) {
    next(error)
  }
}

export default { add, update, updateThenAddIfOk }
