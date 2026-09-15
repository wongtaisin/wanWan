class PaymentService {
  paymentAll = 'SELECT * FROM payment'

  getUserIdPayment = 'SELECT * FROM payment WHERE user_id = ? LIMIT ?, OFFSET ?'
}

export default new PaymentService()
