import type Order from '../entities/Order'

export interface IPaymentGateway {
  createPayment: (order: Order) => Promise<void>
}
