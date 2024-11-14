import { DomainError } from '../../src/entities/base/DomainError'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import { CPF } from '../../src/entities/value-objects/Cpf'

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

describe('Manipulate an order', () => {
  it('Should calculate total order price when its items are correct', () => {
    const tableNumber = 1
    const orderStatus = 'CREATED'
    const sut = new Order('1', tableNumber, orderStatus, orderItems, new CPF('12559757611'))
    const total = sut.getTotal()
    expect(total).toBe(155)
  })
  it('Should fail when Order has no items', () => {
    const tableNumber = 1
    const orderStatus = 'CREATED'
    expect(() => new Order('1', tableNumber, orderStatus, [], new CPF('12559757611'))).toThrow(new DomainError('Order must have at least 1 item'))
  })
  it('Should update Order status with success when a status is set correctly', () => {
    const tableNumber = 1
    const orderStatus = 'CREATED'
    const sut = new Order('1', tableNumber, orderStatus, orderItems, new CPF('12559757611'))
    const orderUpdated = sut.updateStatus('AWAITING_PAYMENT')
    expect(orderUpdated.status).toBe('AWAITING_PAYMENT')
  })
  it('Should fail when Order status is wrong', () => {
    const tableNumber = 1
    const orderStatus: any = 'NO_MAPPED_STATUS'
    expect(() => new Order('1', tableNumber, orderStatus, orderItems, new CPF('12559757611'))).toThrow(new DomainError(`Order status '${orderStatus}' does not exists`))
  })
  it('Should fail when Order status is incorrect', () => {
    const tableNumber = 1
    const orderStatus = 'CREATED'
    const wrongOrderStatus: any = 'NO_MAPPED_STATUS'
    const sut = new Order('1', tableNumber, orderStatus, orderItems)
    expect(() => sut.updateStatus(wrongOrderStatus)).toThrow(`Order status '${wrongOrderStatus}' does not exists`)
  })
})
