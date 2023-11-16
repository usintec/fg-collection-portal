export interface IPagination {
  PageIndex?: number
  PageSize?: number
  SortColumn?: string
  Order?: string
  SearchFilter?: Record<string, string>
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC'
}

export const paginationFormatter = (pagination: IPagination): string => {
  const { PageIndex, PageSize, SortColumn, Order, SearchFilter } = pagination
  const newPagination: IPagination = {}
  if (PageIndex) {
    newPagination.PageIndex = PageIndex
  }
  if (PageSize) {
    newPagination.PageSize = PageSize
  }
  if (SortColumn) {
    newPagination.SortColumn = SortColumn
  }
  if (Order) {
    newPagination.Order = Order
  }
  if (SearchFilter) {
    newPagination.SearchFilter = SearchFilter
  }
  // return as query string
  return `?${new URLSearchParams(newPagination as Record<string, string>)}`
}
