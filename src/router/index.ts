import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import PayableItemsVue from '@/components/payableitems/PayableItems.vue'
import PayableItemDetailVue from '@/components/payableitems/PayableItemDetail.vue'
import PayableItemSettingsVue from '@/components/payableitems/PayableItemSettings.vue'
import PayableVue from '@/components/payableitems/Payable.vue'
import RouteParent from '@/components/ui-elements/RouteParent.vue'
import UiElementsVue from '@/pages/UiElements.vue'
import OrganizationAdminVue from '@/components/organizations/OrganizationAdmin.vue'
import SubOrganizationVue from '@/components/organizations/SubOrganization.vue'
import NotFound from '@/pages/NotFound.vue'
import OrganizationDetailVue from '@/components/organizations/OrganizationDetail.vue'
import RedirectOrgDetailVue from '@/components/organizations/RedirectOrgDetail.vue'
import DashboardVue from '@/pages/Dashboard/Dashboard.vue'
import BillListVue from '@/components/bill/BillList.vue'
import RootRouteVue from '@/components/common/RootRoute.vue'
import CreateBillVue from '@/components/bill/create/CreateBill.vue'
import BillInvoicePageVue from '@/pages/Bill/BillInvoicePage.vue'
import CustomerListVue from '@/components/customer/CustomerList.vue'
import PreviewBillVue from '@/components/bill/PreviewBill.vue'
import EditBillVue from '@/components/bill/create/EditBill.vue'
import GeneralSettingsVue from '@/components/settings/GeneralSettings.vue'
import RedirectSettings from '@/components/settings/RedirectSettings.vue'
import RedirectAllBill from '@/components/payableitems/RedirectAllBill.vue'
import SystemSettingsVue from '@/components/settings/SystemSettings.vue'
import AllUser from '@/components/organizations/AllUser.vue'
import ChangePasswordVue from '@/components/reset/ChangePassword.vue'
import OnboardingPageVue from '@/pages/OnboardingPage.vue'
import Account from '@/components/organizations/Account.vue'
import AccountBalanceVue from '@/components/organizations/AccountBalance.vue'
import GifmisCodeVue from '@/components/organizations/GifmisCode.vue'
import { Permissions } from '@/stores/permissionStore'
import useIsPermitted from '@/hooks/useIsPermitted'
import IntegratorListVue from '@/components/integrators/IntegratorList.vue'
import Profile from '@/components/organizations/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainPage,
    children: [
      {
        path: '/',
        name: 'dashboard',
        props: { name: 'Dashboard' },
        component: DashboardVue,
        permission: [
          Permissions.ViewCollectionReports,
          Permissions.ViewOrganizationReports,
          Permissions.ViewCollectionTrends
        ]
      },
      {
        path: '/payable-items',
        name: 'payable_items',
        component: RouteParent,
        permission: [Permissions.ViewAllPayableItems],
        children: [
          {
            path: '/payable-items',
            name: 'payable_items',
            props: { name: 'Payable Items' },
            component: PayableVue
          },
          {
            path: '/payable-items/create',
            name: 'payable_items_create',
            props: { name: 'Payable Items - Create' },
            component: PayableItemsVue
          },
          {
            path: '/payable-items/details',
            name: 'payable_items_details',
            props: { name: 'Payable Items - Details' },
            component: PayableItemDetailVue
          },
          {
            path: '/payable-items/all-bills',
            name: 'payable_items_all_bills',
            props: { name: 'Payable Items - All Bills' },
            component: RedirectAllBill
          },
          {
            path: '/payable-items/settings',
            name: 'payable_items_settings',
            props: { name: 'Payable Items - Settings' },
            component: PayableItemSettingsVue
          }
        ]
      },
      {
        path: '/organizations',
        name: 'organizations_root',
        props: { title: 'Organization', module: 'organizations' },
        component: RootRouteVue,
        permission: [Permissions.ViewAllOrganizations],
        children: [
          {
            path: '/organizations',
            name: 'organizations_details',
            props: { name: 'Payable Items' },
            component: OrganizationDetailVue,
            permission: [Permissions.ViewOrganization]
          },
          {
            path: '/organizations/details',
            name: 'organizations_details_redirect',
            component: RedirectOrgDetailVue
          },
          {
            path: '/organizations/admins',
            name: 'organizations_admins',
            permission: [Permissions.ViewAdminUser],
            props: { name: 'Payable Items - Create' },
            component: OrganizationAdminVue
          },
          {
            path: '/organizations/sub-organizations',
            name: 'organizations_sub_organization',
            permission: [Permissions.ViewOrganization],
            props: { name: 'Payable Items - Details' },
            component: SubOrganizationVue
          },
          {
            path: '/organizations/settings',
            name: 'organizations_settings',
            permission: [Permissions.CreateOrganizationSettings],
            props: { name: 'Organization - settings' },
            component: GeneralSettingsVue
          },
          {
            path: '/organizations/integrators',
            name: 'organizations_integrators',
            permission: [Permissions.ViewAllIntegrator],
            props: { name: 'Organization - integrators' },
            component: IntegratorListVue
          }
        ]
      },
      {
        path: '/customers',
        name: 'customers',
        props: { name: 'Customers' },
        component: CustomerListVue
      },
      {
        path: '/settings',
        name: 'settings',
        props: { name: 'Settings', module: 'settings' },
        component: RouteParent,
        children: [
          {
            path: '/settings',
            name: 'settings_configurations',
            props: { name: 'Settings - Configuration' },
            component: SystemSettingsVue
          },
          {
            path: '/settings/configuration',
            name: 'configurations',
            props: { name: 'Settings - Configuration' },
            component: RedirectSettings
          },
          {
            path: '/settings/gifmis-codes',
            name: 'settings_gifmis_codes',
            props: { name: 'Settings - GIFMIS Codes' },
            component: GifmisCodeVue
          },
          {
            path: '/settings/accounts',
            name: 'settings_accounts',
            props: { name: 'Settings - Accounts' },
            component: Account
          },
          {
            path: '/settings/account-balances',
            name: 'settings_account_balances',
            props: { name: 'Settings - Accounts Balances' },
            component: AccountBalanceVue
          },
          {
            path: '/settings/profile',
            name: 'settings_profile',
            props: { name: 'Settings - Profile' },
            component: Profile
          }
        ]
      },
      {
        path: '/bills',
        name: 'bills',
        props: { title: 'Bills', module: 'bills' },
        permission: [Permissions.ViewAllBills],
        component: RouteParent,
        children: [
          {
            path: '/bills',
            name: 'billList',
            component: BillListVue
          },
          {
            path: '/bills/create-bill',
            name: 'create new bill',
            component: CreateBillVue
          },
          {
            path: '/bills/:billId/invoices',
            name: 'Bill Invoice page',
            component: BillInvoicePageVue
          },
          {
            path: '/bills/:billId/edit',
            name: 'Bill Edit page',
            component: EditBillVue
          },
          {
            path: '/bills/view-bills',
            name: 'view bill page',
            component: PreviewBillVue
          }
        ]
      },
      {
        path: '/users',
        name: 'users',
        props: { name: 'Users' },
        permission: [Permissions.ViewAllAdminUsers, Permissions.ViewAdminUser],
        component: AllUser
      }
    ]
  },
  {
    path: '/ui-elements',
    name: 'ui-elements',
    component: UiElementsVue
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: ChangePasswordVue
  },
  {
    path: '/onBoarding',
    name: 'onBoarding',
    component: OnboardingPageVue
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: NotFound
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

const publicPages = ['/login', '/resetPassword', '/onBoarding']

const isPublicPage = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (
    !publicPages.includes(to.path ?? '') &&
    to.name !== 'onBoarding' &&
    !localStorage.getItem('refreshToken')
  ) {
    next({ name: 'login' })
    return true
  }
}

const isPermitted = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
  const _routes = routes[0].children ?? []
  const rootName = to.matched[1]?.name ?? ''
  const nextIndex = (_routes.findIndex((route) => route.name === rootName) + 1) % _routes.length
  const route = _routes.find((route) => route.name === to.name)
  const { isPermitted } = useIsPermitted()
  if (!isPermitted(route?.permission)) {
    next({ name: _routes[nextIndex]?.name ?? '404' })
    return true
  }
  return false
}

router.beforeEach((to, _, next) => {
  if (isPublicPage(to, next)) return
  if (isPermitted(to, next)) return
  next()
})

router.afterEach((to, from, failure) => {
  if (failure) {
    console.log(to, from, failure)
  }
})

export default router
