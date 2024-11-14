import type DomainEvent from '../events/DomainEvent'

export default interface IHandler {
  name: string
  handle: <T>(event: DomainEvent<T>) => Promise<void>
}
