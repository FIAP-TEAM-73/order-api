import type Order from '../entities/Order'
export type OrderParams = Partial<Record<keyof Omit<Order, 'getTotal' | 'updateStatus' | 'orderItems'>, string>>
export type OrderPageParams = OrderParams & { page: number, size: number }
export default interface IOrderGateway {
  save: (order: Order) => Promise<string>
  findById: (id: string) => Promise<Order | undefined>
  find: (params: OrderPageParams) => Promise<Order[]>
  count: (params: OrderParams) => Promise<number>
}
