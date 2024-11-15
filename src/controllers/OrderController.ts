import type EventHandler from '../handlers/EventHandler'
import IOrderGateway, { type OrderPageParams } from '../interfaces/IOrderGateway'
import { type HttpResponse } from '../presenters/HttpResponses'
import ChangeOrderStatusUseCase, { type ChangeOrderStatusCommand } from '../usecases/ChangeOrderStatusUseCase'
import { FindOrderUseCase } from '../usecases/FindOrderUseCase'
import PlaceOrderUseCase, { type PlaceOrderCommand } from '../usecases/PlaceOrderUseCase'

export default class OrderController {
  private readonly placeOrderUseCase: PlaceOrderUseCase
  private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase
  private readonly findOrderUseCase: FindOrderUseCase

  constructor (orderGateway: IOrderGateway, eventHandler: EventHandler) {
    this.placeOrderUseCase = new PlaceOrderUseCase(orderGateway, eventHandler)
    this.changeOrderStatusUseCase = new ChangeOrderStatusUseCase(orderGateway)
    this.findOrderUseCase = new FindOrderUseCase(orderGateway)
  }

  async placeOrder (command: PlaceOrderCommand): Promise<HttpResponse> {
    return await this.placeOrderUseCase.execute(command)
  }

  async changeOrderStatus (orderId: string, command: ChangeOrderStatusCommand): Promise<HttpResponse> {
    return await this.changeOrderStatusUseCase.execute(orderId, command)
  }

  async findOrder (params: OrderPageParams): Promise<HttpResponse> {
    return await this.findOrderUseCase.execute(params)
  }

}
