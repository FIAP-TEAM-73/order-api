import type Order from '../entities/Order'
import { type IPaymentIntegrationGateway, type IPaymentIntegrationResponse } from '../interfaces/IPaymentIntegrationGateway'
import { v4 as uuidv4 } from 'uuid'

export default class PaymentIntegrationInMemoryGateway implements IPaymentIntegrationGateway {
  async createPayment (order: Order): Promise<IPaymentIntegrationResponse> {
    console.log(`New payment order requested. Order: ${order.id}, total: ${order.getTotal()}`)
    return await Promise.resolve({
      integrationId: uuidv4(),
      qrCode: '00020101021243650016COM'
    })
  }
}
