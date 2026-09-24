import mysql from '../config/mysql'
import ledgerNameService from '../service/ledgerNameService'
import { ReSuccess } from '../util/response'

class LedgerNameController {
  /**
   * @description 检查类型是否存在
   * @param {any} req 请求对象
   * @param {any} res 响应对象
   */
  checkType = async (req: any, res: any) => {
    const { type } = req.query
    const result = (await mysql.query(ledgerNameService.checkType(type), [
      req.auth.user_id,
      type
    ] as never[])) as any[]

    ReSuccess(res, 200, '获取成功', {
      list: result
    })
  }
}

export default new LedgerNameController()
