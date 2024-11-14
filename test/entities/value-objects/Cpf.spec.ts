import { DomainError } from '../../../src/entities/base/DomainError'
import { CPF } from '../../../src/entities/value-objects/Cpf'

describe('Create a CPF', () => {
  it('Should create a CPF when its value is valid', () => {
    const cpfValue = '48720041241'
    const sut = new CPF(cpfValue)
    expect(sut.value).toBe(cpfValue)
  })
  it('Should not create a CPF when its value is invalid', () => {
    expect(() => new CPF('')).toThrow(new DomainError('Cpf must have only numbers and 11 characteres!'))
  })
})
