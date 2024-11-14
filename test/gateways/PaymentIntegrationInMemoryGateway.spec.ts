import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import PaymentIntegrationInMemoryGateway from '../../src/gateways/PaymentIntegrationInMemoryGateway'
import { type IPaymentIntegrationGateway } from '../../src/interfaces/IPaymentIntegrationGateway'
import * as uuid from 'uuid'

jest.mock('uuid')

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const order = new Order('1', 2, 'CREATED', orderItems)

describe('Payment integration in memory gateway', () => {
  const integrationId = new Uint8Array();
  jest.spyOn(uuid, 'v4').mockReturnValueOnce(integrationId)
  it('Should return a fake payment integration when Payment in memory is called', async () => {
    const sut: IPaymentIntegrationGateway = new PaymentIntegrationInMemoryGateway()
    const result = await sut.createPayment(order)
    expect(result).toEqual({ integrationId, qrCode: '00020101021243650016COM' })
  })
})
