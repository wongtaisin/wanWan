/**
 * @description 资源不存在错误
 * @param {any} message 错误消息
 */
export class NotFoundError extends Error {
  constructor(message: any) {
    super(message)
    this.name = 'NotFoundError'
  }
}

/**
 * @description 请求成功
 * @param {any} res 响应对象
 * @param {number} code 状态码
 * @param {string} message 消息
 * @param {any} data 数据
 */
export const ReSuccess = (res: any, code: number, message?: string, data?: any) => {
  res.status(200).json({ code, data, message })
}

/**
 * @description 请求失败
 * @param {any} res 响应对象
 * @param {string} message 消息
 * @param {any} error 错误对象
 */
export const ReFail = (res: any, message: string, error?: any) => {
  console.error(message, error)

  if (error?.name === 'NotFoundError') {
    return res.status(404).json({
      code: 404,
      message: '资源不存在',
      errors: [error.message]
    })
  }

  res.status(500).json({
    code: -1,
    message: message,
    errors: [error?.message]
  })
}

/**
 * @description 图片上传成功
 * @param {any} res 响应对象
 * @param {string} source 上传来源
 * @param {{ url: any; id: any }} img 图片对象
 */
export const imgSuccess = (res: any, source: string, img: { url: any; id: any }) => {
  if (source == 'TinyMCE') {
    res.status(200).json({ location: img.url, id: img.id })
  } else {
    ReSuccess(res, 0, '上传文件成功', { id: img.id, url: img.url })
  }
}
