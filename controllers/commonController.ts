/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-08 16:09:06
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-14 15:49:52
 * @FilePath: \wanWan\controllers\commonController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import fs from 'fs'
import redis from '../db/redis'

export const uploadFile = (req: any, res: any) => {
  try {
    // 上传成功后，文件信息在 req.file 中
    const fileInfo = req.file
    if (!fileInfo) {
      return res.status(400).json({
        code: 400,
        message: '请上传文件'
      })
    }

    // 文件存储路径：public/images/[uuid].[ext]
    const filePath = fileInfo.path
    const fileName = fileInfo.filename

    // 可以将文件信息保存到数据库
    // db.query('INSERT INTO files (name, path) VALUES (?, ?)', [fileName, filePath]);

    res.status(200).json({
      message: '上传成功',
      data: {
        fileName,
        filePath,
        url: `/images/${fileName}` // 前端访问路径
      }
    })
  } catch (error: any) {
    res.status(500).json({ message: '上传失败', error: error.message })
  }
}

const AREA_DATA_CACHE_KEY = 'common:area-tree'
const AREA_DATA_TTL_SECONDS = 60 * 60 * 6 // 6 小时

// 新增获取地区数据接口
export const getAreaData = async (req: any, res: any) => {
  try {
    const cached = await redis.get(AREA_DATA_CACHE_KEY)
    if (cached) {
      return res.status(200).json({
        code: 200,
        data: JSON.parse(cached),
        message: '获取地区数据成功（缓存）'
      })
    }

    // 读取JSON文件
    const filePath = require.resolve('../json/area-city-china.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const areaData = handleTree(JSON.parse(data))

    await redis.set(AREA_DATA_CACHE_KEY, JSON.stringify(areaData), 'EX', AREA_DATA_TTL_SECONDS)

    res.status(200).json({
      code: 200,
      data: areaData,
      message: '获取地区数据成功'
    })
  } catch (error: any) {
    res.status(500).json({
      code: 500,
      error: error.message,
      message: '读取地区数据失败'
    })
  }
}

const handleTree = (data: any, parent_code = null) => {
  let res = []
  let keys = {
    id: 'code',
    pid: 'parent_code',
    children: 'children',
    text: 'name',
    value: 'code'
  }
  let oneItemDEMO = {
    text: '',
    value: '',
    children: []
  }
  let oneItem = {} as any

  // 循环
  for (let index in data) {
    // 判断
    if (parent_code === null) {
      // 顶级菜单 - 省
      if (!data[index].hasOwnProperty(keys.pid) || data[index][keys.pid] == parent_code) {
        // 不存在parent_code，或者已匹配
        oneItem = JSON.parse(JSON.stringify(oneItemDEMO))
        oneItem.text = data[index][keys.text]
        oneItem.value = data[index][keys.value]

        // 递归下去
        oneItem.children = handleTree(data, data[index][keys.id])
        res.push(oneItem)
      }
    } else {
      // 非顶级菜单 - 市、区、街道
      if (data[index].hasOwnProperty(keys.pid) && data[index][keys.pid] == parent_code) {
        // 已匹配
        oneItem = JSON.parse(JSON.stringify(oneItemDEMO))
        oneItem.text = data[index][keys.text]
        oneItem.value = data[index][keys.value]

        // 递归下去
        oneItem.children = handleTree(data, data[index][keys.id])
        res.push(oneItem)
      }
    }
  }

  return res
}
