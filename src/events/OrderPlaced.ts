import type DomainEvent from './DomainEvent'

export default class OrderPlaced implements DomainEvent<string> {
  name: string = 'orderPlaced'
  constructor (readonly value: string) {}
}
