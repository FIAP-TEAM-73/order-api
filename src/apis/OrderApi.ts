import { type IHttp } from '../interfaces/IHttp'
import type EventHandler from '../handlers/EventHandler'
import { type ChangeOrderStatusCommand } from '../usecases/ChangeOrderStatusUseCase'
import { type PlaceOrderCommand } from '../usecases/PlaceOrderUseCase'
import OrderController from '../controllers/OrderController'
import IOrderGateway, { type OrderPageParams } from '../interfaces/IOrderGateway'
import { IApi } from '../interfaces/IApi'

export default class OrderApi implements IApi {
  private readonly orderController: OrderController
  constructor (
    private readonly http: IHttp,
    gateway: IOrderGateway,
    eventHandler: EventHandler
  ) {
    this.orderController = new OrderController(gateway, eventHandler)
  }

  init (): void {
    void this.http.route('post', 'order', async (_: any, body: PlaceOrderCommand) => {
      return await this.orderController.placeOrder(body)
    })
    void this.http.route('get', 'order', async (req: { query: OrderPageParams }) => {
      return await this.orderController.findOrder(req.query)
    })
    void this.http.route('put', 'order/:id', async (req: { params: { id: string } }, body: ChangeOrderStatusCommand) => {
      return await this.orderController.changeOrderStatus(req.params.id, body)
    })
  }
}
