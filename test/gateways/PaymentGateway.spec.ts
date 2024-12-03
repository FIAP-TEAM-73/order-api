import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import * as uuid from 'uuid'
import { IIntegration } from '../../src/interfaces/IIntegration'
import { IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import PaymentGateway from '../../src/gateways/PaymentGateway'

jest.mock('uuid')

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const order = new Order('1', 2, 'CREATED', orderItems)

describe('Payment integration gateway', () => {
  const integrationId = new Uint8Array();
  jest.spyOn(uuid, 'v4').mockReturnValueOnce(integrationId)
  const mockIntegration: IIntegration = {
    post: jest.fn(async () => Promise.resolve()),
    put: jest.fn(async () => Promise.resolve()),
    get: jest.fn(async () => Promise.resolve())
}
  it('Should create a payment when Integration works', async () => {
    const request = {
      orderId: order.id,
      cpf: order.cpf?.value,
      orderValue: order.getTotal()
    }
    const sut: IPaymentGateway = new PaymentGateway(mockIntegration)
    await sut.createPayment(order)
    expect(mockIntegration.post).toHaveBeenCalledWith('/payment', request, {})
  })
})
