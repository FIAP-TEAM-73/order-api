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
      console.info(`[POST] - Receiving a request on "/api/v1/order" body: ${JSON.stringify(body)}`)
      return await this.orderController.placeOrder(body)
    })
    void this.http.route('get', 'order', async (req: { query: OrderPageParams }) => {
      console.info(`[GET] - Receiving a request on "/api/v1/order" params: ${JSON.stringify(req)}`)
      return await this.orderController.findOrder(req.query)
    })
    void this.http.route('put', 'order/:id', async (req: { params: { id: string } }, body: ChangeOrderStatusCommand) => {
      console.info(`[PUT] - Receiving a request on "/api/v1/order/:id" body: ${JSON.stringify(body)}, params: ${JSON.stringify(req)}`)
      return await this.orderController.changeOrderStatus(req.params.id, body)
    })
  }
}
