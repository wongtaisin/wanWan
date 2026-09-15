import mysql from '../config/mysql'
import paymentService from '../service/paymentService'

class PaymentController {
  all = async (req: any, res: any, next: any) => {
    const result = await mysql.query(paymentService.paymentAll, [])

    res.json({
      code: 200,
      data: result,
      message: '查询支付列表成功'
    })
  }
}

export default new PaymentController()
