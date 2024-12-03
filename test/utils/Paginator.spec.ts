import Paginator from '../../src/utils/Paginator'

describe('Pagination', () => {
  it('Should return firstPage when page is 0', () => {
    const sut = new Paginator([], 10, 1, 100)
    expect(sut.isFirstPage()).toBe(true)
  })
  it('Should return totalPages 10 when size is 3 and content is 30', () => {
    const sut = new Paginator(['John', 'Mary', 'Anna'], 3, 1, 30)
    expect(sut.getTotalPages()).toBe(10)
  })
  it('Should return lastPage when there is no items', () => {
    const sut = new Paginator(['John'], 10, 1, 1)
    expect(sut.isLastPage()).toBe(true)
  })
})
