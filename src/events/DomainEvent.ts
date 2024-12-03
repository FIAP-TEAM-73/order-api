export default interface DomainEvent<T> {
  name: string
  value: T
}
