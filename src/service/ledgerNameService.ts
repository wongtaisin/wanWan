class LedgerNameService {
  checkType(type: string) {
    const sql = type ? ` AND type = ?` : ``

    return `SELECT *, DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date FROM ledger_name WHERE 1=1 AND user_id = ? ${sql}`
  }
}

export default new LedgerNameService()
