import { assertArgumentMinArrayLength, assertArgumentUnionType } from './base/AssertionConcerns'
import type OrderItem from './OrderItem'
import { CPF } from './value-objects/Cpf'


const statusValue = ['CREATED', 'CANCELED', 'AWAITING_PAYMENT', 'PAYMENT_REFUSED', 'PAYMENT_ACCEPTED', 'RECEIVED', 'IN_PROGRESS', 'READY', 'DONE'] as const

export type OrderStatus = (typeof statusValue)[number]
export default class Order {
  constructor (
    readonly id: string,
    readonly tableNumber: number,
    readonly status: OrderStatus,
    readonly orderItems: OrderItem[],
    readonly cpf: CPF | undefined = undefined
  ) {
    assertArgumentMinArrayLength(orderItems, 1, 'Order must have at least 1 item')
    assertArgumentUnionType(status, Object.values(statusValue), `Order status '${status}' does not exists`)
  }

  getTotal (): number {
    const total = this.orderItems.reduce((acc: number, curr: OrderItem): number => {
      return acc + curr.calculateTotal()
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  updateStatus (status: OrderStatus): Order {
    assertArgumentUnionType(status, Object.values(statusValue), `Order status '${status}' does not exists`)
    return {
      ...this,
      status
    }
  }
}
