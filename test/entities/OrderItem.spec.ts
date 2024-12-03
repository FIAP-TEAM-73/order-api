import { DomainError } from '../../src/entities/base/DomainError'
import OrderItem from '../../src/entities/OrderItem'

describe('Calculate OrderItem total value', () => {
  it('Should calculate the total price when the OrderItem is valid', () => {
    const itemPrice = 30.00
    const itemQuantity = 2
    const sut = new OrderItem('any_item_id', 'any_order_id', itemPrice, itemQuantity)
    const totalPrice = sut.calculateTotal()
    expect(totalPrice).toBe(60)
  })
  it('Should fail when price is under than 1', () => {
    const itemPrice = -1
    const itemQuantity = 2
    expect(() => new OrderItem('any_item_id', 'any_order_id', itemPrice, itemQuantity)).toThrow(new DomainError('Price must be greater than 1'))
  })
  it('Should fail when quantity is under than 1', () => {
    const itemPrice = 30
    const itemQuantity = 0
    expect(() => new OrderItem('any_item_id', 'any_order_id', itemPrice, itemQuantity)).toThrow(new DomainError('Quantity must be greater than 1'))
  })
})
