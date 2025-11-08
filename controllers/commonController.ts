/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-08 16:09:06
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2025-11-08 17:12:31
 * @FilePath: \wanWan\controllers\commonController.ts
 * @Description:
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
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
