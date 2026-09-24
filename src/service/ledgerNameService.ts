class LedgerNameService {
  checkType = `SELECT *, DATE_FORMAT(create_date, '%Y-%m-%d %H:%i:%s') AS create_date FROM ledger_name WHERE 1=1 AND user_id = ? AND type = ?`
}

export default new LedgerNameService()
