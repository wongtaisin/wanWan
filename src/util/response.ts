// 未知错误
class NotFoundError extends Error {
  constructor(message: any) {
    super(message)
    this.name = 'NotFoundError'
  }
}

// 请求成功
const ReSuccess = (res: any, code: number, message?: string, data?: any) => {
  res.status(200).json({ code, data, message })
}

// 请求失败
const ReFail = (res: any, message: string, error?: any) => {
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

export { NotFoundError, ReFail, ReSuccess }
