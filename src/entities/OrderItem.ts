import { assertArgumentMin } from './base/AssertionConcerns'

export default class OrderItem {
  constructor (
    readonly itemId: string,
    readonly orderId: string,
    readonly price: number,
    readonly quantity: number) {
    assertArgumentMin(price, 1, 'Price must be greater than 1')
    assertArgumentMin(quantity, 1, 'Quantity must be greater than 1')
  }

  calculateTotal (): number {
    return this.price * this.quantity
  }
}
