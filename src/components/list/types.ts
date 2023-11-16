import type { Permissions } from '@/stores/permissionStore'

export interface IListColumn<T> {
  id: string
  name: string
  dataFiled: keyof T
  isSortable?: boolean
  isFilterable?: boolean
  cell?: boolean
  width: number
  required?: boolean
  permissions?: Permissions[]
}

export interface IListState<T> {
  perPage: number
  page: number
  data: T[]
  totalPage: number
  hover?: number
}

export interface ICSVHeader {
  name: string
  key: string
}
