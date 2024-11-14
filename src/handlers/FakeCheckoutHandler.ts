import type IHandler from '../interfaces/IHandler'
import type DomainEvent from '../events/DomainEvent'
import OrderPlaced from '../events/OrderPlaced'
import { type IPaymentIntegrationGateway } from '../interfaces/IPaymentIntegrationGateway'
import type Order from '../entities/Order'
import type IOrderGateway from '../interfaces/IOrderGateway'

export default class FakeCheckoutHandler implements IHandler {
  name: string = 'orderPlaced'

  constructor(private readonly orderGateway: IOrderGateway, private readonly paymentIntegrationGateway: IPaymentIntegrationGateway) { }

  async handle<T>(event: DomainEvent<T>): Promise<void> {
    if (event instanceof OrderPlaced) {
      const order = await this.orderGateway.findById(event.value)
      if (order === undefined) throw new Error(`Order with id ${event.value} does not exists`)
      await this.createPayment(order)
      await this.orderGateway.save(order.updateStatus('AWAITING_PAYMENT'))
    }
  }

  private async createPayment(order: Order): Promise<void> {
    await this.paymentIntegrationGateway.createPayment(order)
  }
}
