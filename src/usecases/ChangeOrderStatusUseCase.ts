import { type OrderStatus } from '../entities/Order'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { type HttpResponse, noContent, notFoundError } from '../presenters/HttpResponses'

export interface ChangeOrderStatusCommand {
  status: OrderStatus
}
export default class ChangeOrderStatusUseCase {
  constructor (private readonly orderGateway: IOrderGateway) {}

  async execute (orderId: string, command: ChangeOrderStatusCommand): Promise<HttpResponse> {
    const order = await this.orderGateway.findById(orderId)
    if (order === undefined) return notFoundError(`Order ${orderId} does not exist!`)
    await this.orderGateway.save(order.updateStatus(command.status))
    return noContent()
  }
}
