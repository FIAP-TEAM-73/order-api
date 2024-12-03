import type IHandler from '../interfaces/IHandler'
import type DomainEvent from '../events/DomainEvent'
import OrderPlaced from '../events/OrderPlaced'
import type Order from '../entities/Order'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { IPaymentGateway } from '../interfaces/IPaymentGateway'

export default class FakeCheckoutHandler implements IHandler {
  name: string = 'orderPlaced'

  constructor(private readonly orderGateway: IOrderGateway, private readonly paymentGateway: IPaymentGateway) { }

  async handle<T>(event: DomainEvent<T>): Promise<void> {
    try {
      if (event instanceof OrderPlaced) {
        const order = await this.orderGateway.findById(event.value)
        if (order === undefined) throw new Error(`Order with id ${event.value} does not exists`)
        await this.createPayment(order)
        await this.orderGateway.save(order.updateStatus('AWAITING_PAYMENT'))
      }
    } catch (error) {
      console.error(`Error while creating a payment`, error instanceof Error ? error.message : JSON.stringify(error))
      throw error
    }
  }

  private async createPayment(order: Order): Promise<void> {
    await this.paymentGateway.createPayment(order)
  }
}
