import { assertArgumentLength } from '../base/AssertionConcerns'

export class CPF {
  constructor (readonly value: string) {
    const cpfLength = 11;
    assertArgumentLength(value, cpfLength, cpfLength, 'Cpf must have only numbers and 11 characteres!')
  }
}
