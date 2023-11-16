import type { Permissions } from '@/stores/permissionStore'

export interface SubMenu {
  label: string
  permission: Permissions[]
}
export interface IMenu {
  label: string
  icon: string
  link: string
  permission?: Permissions[]
  onClick?: () => void
  counter?: number
  subMenu?: (string | SubMenu)[]
  showSubMenuOnClick?: boolean
}
