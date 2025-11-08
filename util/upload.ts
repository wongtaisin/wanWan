/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-10-11 08:22:31
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-08 16:06:02
 * @FilePath: \wanWan\util\upload.ts
 * @Description: 上传文件到服务器
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import path from 'path'
const fs = require('fs')
const multer = require('multer')
const uuid = require('uuid')

const memoryDest = path.join(__dirname, '../public/images')

const storage = multer.diskStorage({
  // 文件存储位置
  destination: (req: any, file: any, cb: any) => {
    // 校验文件夹是否存在，如果不存在则创建一个
    const isExists = fs.existsSync(memoryDest)
    if (!isExists) {
      fs.mkdirSync(memoryDest)
    }
    cb(null, memoryDest)
  },
  filename: (req: any, file: any, cb: any) => {
    // 生成唯一文件名
    const uid = uuid.v1()
    // 获取文件扩展名
    let ext = path.extname(file.originalname)
    cb(null, `${uid}_${ext}`)
  }
})

// 过滤文件
function fileFilter(req: any, file: any, callback: any) {
  if (!file) {
    callback(null, false)
  } else {
    callback(null, true)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
}).single('file') //上传的fieldname必须为file

module.exports = upload
