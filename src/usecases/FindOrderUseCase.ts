import type IOrderGateway from '../interfaces/IOrderGateway'
import { type OrderPageParams } from '../interfaces/IOrderGateway'
import { type HttpResponse, ok, badRequest } from '../presenters/HttpResponses'
import Paginator from '../utils/Paginator'
export class FindOrderUseCase {
  constructor (private readonly orderGateway: IOrderGateway) { }

  async execute (params: OrderPageParams): Promise<HttpResponse> {
    const { page = 1, size = 10, ...rest } = params
    if (+size < 1) return badRequest('Size must be greater than 0')
    if (+page < 1) return badRequest('Page must be greater than 0')
    const total = await this.orderGateway.count(rest)
    const items = await this.orderGateway.find({ ...params, page: page - 1, size })
    const pagination = new Paginator(items, +size, +page, +total)
    return ok({
      content: pagination.content.map((order) => ({ ...order, total: order.getTotal() })),
      pageSize: size,
      page,
      totalPages: pagination.getTotalPages(),
      isFirstPage: pagination.isFirstPage(),
      isLastPage: pagination.isLastPage()
    })
  }
}
