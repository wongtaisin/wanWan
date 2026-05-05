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
import fs from 'fs' // 这是 Node.js 中用于文件系统操作的模块
import multer from 'multer' // 这是一个在 Node.js 中非常流行的处理 multipart/form-data（通常用于文件上传）的中间件库.
import path from 'path' // 这是 Node.js 中用于处理文件路径的模块
import { v7 as uuidV7 } from 'uuid' // 这是一个用于生成唯一标识符的库

const memoryDest = path.join(__dirname, '../public/uploads') // 这是文件上传的目标目录

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
    const uid = uuidV7()
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

export default upload
