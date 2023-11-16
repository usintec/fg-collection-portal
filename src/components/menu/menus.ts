import { Permissions } from '@/stores/permissionStore'
import type { IMenu } from './types'
export const menuItems: IMenu[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    link: '/',
    permission: [
      Permissions.ViewCollectionReports,
      Permissions.ViewOrganizationReports,
      Permissions.ViewCollectionTrends
    ]
  },
  {
    label: 'Payable Items',
    icon: 'checklist',
    link: '/payable-items',
    counter: 20,
    subMenu: ['Payable Items', 'Settings'],
    showSubMenuOnClick: true,
    permission: [Permissions.ViewAllPayableItems]
  },
  {
    label: 'Organization',
    icon: 'work',
    link: '/organizations',
    permission: [Permissions.ViewAllOrganizations],
    subMenu: [
      {
        label: 'Details',
        permission: [Permissions.ViewOrganization]
      },
      {
        label: 'Sub Organizations',
        permission: [Permissions.ViewAllSubOrganizations]
      },
      {
        label: 'Admins',
        permission: [Permissions.ViewAdminUser]
      },
      {
        label: 'Settings',
        permission: [Permissions.CreateOrganizationSettings]
      },
      {
        label: 'Integrators',
        permission: [Permissions.ViewAllIntegrator]
      }
    ],
    showSubMenuOnClick: true
  },
  {
    label: 'Customers',
    icon: 'person',
    link: '/customers'
  },
  {
    label: 'Bills',
    icon: 'payments',
    link: '/bills',
    permission: [Permissions.ViewAllBills],
    showSubMenuOnClick: false
  }
]

export const sendMenus: IMenu[] = [
  {
    label: 'Users',
    icon: 'group',
    link: '/users',
    showSubMenuOnClick: true,
    permission: [Permissions.ViewAllAdminUsers, Permissions.ViewAdminUser]
  },
  {
    label: 'Settings',
    icon: 'settings',
    link: '/settings',
    subMenu: ['Configuration', 'GIFMIS Codes', 'Accounts', 'Profile'],
    showSubMenuOnClick: true
  }
]

export const logout: IMenu = {
  label: 'Logout',
  icon: 'logout',
  link: '/'
}
