import { DomainError } from './DomainError'

export const assertArgumentLength = (value: string, min: number, max: number, message: string = 'Must not be empty!'): void => {
  const length = value.trim().length
  if (length < min || length > max) throw new DomainError(message)
}

export const assertArgumentMin = (value: number, min: number, message?: string): void => {
  if (value < min) throw new DomainError(message ?? `Should be greater than ${min}`)
}

export const assertArgumentMinArrayLength = (value: unknown[], min: number, message?: string): void => {
  if (value.length < min) throw new DomainError(message ?? `Array must have at least ${min} item(s)`)
}

export const assertArgumentUnionType = (value: string, types: string[], message?: string): void => {
  if (!types.includes(value)) throw new DomainError(message ?? `Value must be part of ${JSON.stringify(types)}`)
}

export const assertAtLeastOneNotEmptyArgument = (values: Array<string | undefined>, message?: string): void => {
  if (values.every((value) => value === undefined || value?.trim()?.length === 0)) {
    throw new DomainError(message ?? 'At least one argument must be valid!')
  }
}
