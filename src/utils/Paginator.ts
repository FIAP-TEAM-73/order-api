export default class Paginator<T> {
  constructor (
    readonly content: T[],
    readonly size: number,
    readonly page: number,
    readonly total: number
  ) {}

  isFirstPage (): boolean {
    return this.page === 1
  }

  getTotalPages (): number {
    if (this.total === 0) return 1
    return Math.ceil(this.total / this.size)
  }

  isLastPage (): boolean {
    return this.getTotalPages() <= this.page
  }
}
