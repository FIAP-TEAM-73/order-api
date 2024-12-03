import { notFoundError } from '../../src/presenters/HttpResponses'
import ChangeOrderStatusUseCase, { type ChangeOrderStatusCommand } from '../../src/usecases/ChangeOrderStatusUseCase'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import type IOrderGateway from '../../src/interfaces/IOrderGateway'

const mockUpdateOrderStatusCommand: ChangeOrderStatusCommand = {
  status: 'CANCELED'
}
const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const mockOrder = new Order('any_id', 2, 'CREATED', orderItems)
describe('Update Order status use case', () => {
  const mockOrderGateway: IOrderGateway = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.resolve(mockOrder)),
    find: jest.fn(async (_params: any) => await Promise.reject(new Error())),
    count: jest.fn(async (_params: any) => await Promise.reject(new Error()))
  }
  it('Should update Order status with success when Order exists', async () => {
    const orderId = 'any_id'
    const sut = new ChangeOrderStatusUseCase(mockOrderGateway)
    await sut.execute(orderId, mockUpdateOrderStatusCommand)
    expect(mockOrderGateway.findById).toHaveBeenCalledWith(orderId)
    expect(mockOrderGateway.save).toHaveBeenCalledWith(mockOrder.updateStatus('CANCELED'))
  })
  it('Should return not found when Order does not exist', async () => {
    const mockOrderGatewayNotFound: IOrderGateway = {
      ...mockOrderGateway,
      findById: jest.fn(async (_id: string) => { return undefined })
    }
    const orderId = 'any_id'
    const sut = new ChangeOrderStatusUseCase(mockOrderGatewayNotFound)
    const result = await sut.execute(orderId, mockUpdateOrderStatusCommand)
    expect(result).toEqual(notFoundError(`Order ${orderId} does not exist!`))
  })
})
