import { CombineLogic } from '@/services/types'
import { defineStore } from 'pinia'

export enum Permissions {
  ActivatePayableItem = 'ActivatePayableItem', // ✓
  AddUserPermission = 'AddUserPermission', // ✓
  AddUserRole = 'AddUserRole', // ✓
  CompleteBill = 'CompleteBill', // ✓
  CreateAdminUser = 'CreateAdminUser', // ✓
  CreateBill = 'CreateBill', // ✓
  CreateBillingSettings = 'CreateBillingSettings',
  CreateCustomer = 'CreateCustomer', // ✓
  CreateNotificationPreference = 'CreateNotificationPreference', // ✓
  CreateOrganization = 'CreateOrganization', // ✓
  CreateOrganizationSettings = 'CreateOrganizationSettings', // ✓
  CreatePayableItem = 'CreatePayableItem', // ✓
  CreateRole = 'CreateRole',
  CreateTsaSettings = 'CreateTsaSettings', // ✓
  DeactivatePayableItem = 'DeactivatePayableItem', // ✓
  DeleteBillingSettings = 'DeleteBillingSettings', // ✓
  DeleteRole = 'DeleteRole', // ✓
  DeleteTsaSettings = 'DeleteTsaSettings', // ✓
  EditBill = 'EditBill', // ✓
  GetGIFMISCodePermission = 'GetGIFMISCodePermission',
  GetGIFMISCodesPermission = 'GetGIFMISCodesPermission',
  GetNotificationPreference = 'GetNotificationPreference', // ✓
  IncrementInvoice = 'IncrementInvoice', // ✓
  RebateInvoice = 'RebateInvoice', // ✓
  RejectedAll = 'RejectedAll',
  RemoveUserRole = 'RemoveUserRole', // ✓
  SearchCustomer = 'SearchCustomer', // ✓
  SetupUsers = 'SetupUsers', // ✓
  UpdateAdminUser = 'UpdateAdminUser',
  UpdateBillingSettings = 'UpdateBillingSettings', // ✓
  UpdateNotificationPreference = 'UpdateNotificationPreference', // ✓
  UpdateOrganization = 'UpdateOrganization', // ✓
  UpdatePartialPayment = 'UpdatePartialPayment',
  UpdatePayableItem = 'UpdatePayableItem',
  UpdateRole = 'UpdateRole', // ✓
  UpdateTsaSettings = 'UpdateTsaSettings', // ✓
  UpdateUserPermission = 'UpdateUserPermission', // ✓
  UploadBulkGIFMISCodes = 'UploadBulkGIFMISCodes',
  UploadBulkMDAs = 'UploadBulkMDAs',
  UploadBulkPayableItem = 'UploadBulkPayableItem', // ✓
  ViewAdminUser = 'ViewAdminUser', // ✓
  ViewAllAdminUsers = 'ViewAllAdminUsers', // ✓
  ViewAllBills = 'ViewAllBills', // ✓
  ViewAllIntegrators = 'ViewAllIntegrators',
  ViewAllInvoices = 'ViewAllInvoices', // ✓
  ViewAllOrganizations = 'ViewAllOrganizations', // ✓
  ViewAllPayableItems = 'ViewAllPayableItems', // ✓
  ViewAllRole = 'ViewAllRole', // ✓
  ViewAllSubOrganizations = 'ViewAllSubOrganizations', // ✓
  ViewBill = 'ViewBill', // ✓
  ViewBillingSettings = 'ViewBillingSettings',
  ViewCollectionReports = 'ViewCollectionReports',
  ViewCollectionTrends = 'ViewCollectionTrends',
  ViewInvoice = 'ViewInvoice',
  ViewOrganization = 'ViewOrganization', // ✓
  ViewOrganizationReports = 'ViewOrganizationReports', // ✓
  ViewPayableItem = 'ViewPayableItem', // ✓
  ViewRole = 'ViewRole',
  ViewTsaSettings = 'ViewTsaSettings',
  ViewUserPermission = 'ViewUserPermission',
  ViewUserRole = 'ViewUserRole',
  ViewAllIntegrator = 'ViewAllIntegrator'
}

interface State {
  userPermissions: Permissions[]
  loading: boolean
}

export const useUserPermission = defineStore('userPermission', {
  state: () =>
    ({
      userPermissions: [] as Permissions[],
      loading: true
    } as State),
  actions: {
    setUserPermissions(per: Permissions[]) {
      this.userPermissions = per
      this.loading = false
    },
    permitted(per: Permissions | Permissions[], logic = CombineLogic.AND): boolean {
      const fun = (p: Permissions) => this.userPermissions.includes(p)
      return Array.isArray(per)
        ? logic === CombineLogic.AND
          ? per.every(fun)
          : per.some(fun)
        : this.userPermissions.includes(per)
    }
  }
})
