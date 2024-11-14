import type DomainEvent from '../events/DomainEvent'
import type IHandler from '../interfaces/IHandler'

export default class EventHandler {
  constructor (private readonly handlers: IHandler[]) {}

  async publish<T> (event: DomainEvent<T>): Promise<void> {
    await Promise.all(this.handlers.map(async (handler) => {
      if (handler.name === event.name) {
        await handler.handle(event)
      }
    }))
  }
}
