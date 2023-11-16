import type { IListColumn } from '@/components/list/types'
import type { Permissions } from '@/stores/permissionStore'

export interface ILoginResponse {
  access_token: string
  expires_in: number
  token_type: string
  refresh_token: string
  scope: string
}

export interface IUserInfo {
  sub: string
  Email: string
  preferred_username: string
  name: string
  email_verified: boolean
  userId: string
  tenant: string
  lastLogin: string
  fullName: string
  organizationName: string
  organizationCode: string
  organizationId: string
  parentOrganizationId: string
  parentOrganizationName: string
  parentOrganizationCode: string
  permission: Permissions[]
  jobTitle?: string
  phoneNumber?: string
  role?: string
  userImage?: string
}

export interface IOrganization {
  id: string
  organizationId: string
  uniqueRequestId?: string
  parentOrganizationId?: string
  organizationName: string
  organizationCode: string
  organizationCity?: string
  organizationState?: string
  organizationEmail?: string
  organizationAddress?: string
  organizationWebsite?: string
  organizationContactPersonName?: string
  organizationContactPersonEmail?: string
  organizationContactPersonPhoneNumber?: string
  organizationPhoneNumber?: string
  adminUserInformation?: AdminUserInformation
  organizationStatus?: string
  createdOn?: Date
  parentOrganization?: IOrganization
}

export interface AdminUserInformation {
  firstName: string
  lastName: string
  emailAddress: string
}

export interface ICreateAdmin {
  organizationId: string
  adminUserModel: Partial<IAdminUser>
}

export interface IAdminUser {
  value: { firstName: string | undefined; lastName: string | undefined; email: string | undefined }
  id: string
  email: string
  firstName: string
  lastName: string
  roleId: string
  role: string
  username: string
  createdOn: string
  permissions?: string[]
}

export interface IEditAdminUser {
  roleId: string
  uniqueRequestId: string
  permissions?: string[]
  id: string
  name: string
  description?: string
  displayName?: string
}

export interface ErrorMessage {
  statusCode: number
  message: string
  errors: Errors
}

export interface Errors {
  generalErrors: string[]
}

export interface RootAPIResponse<T> {
  hasError: boolean
  value: T
  error: Error
}

export interface PaginatedResult<T> {
  currentPage: number
  pageCount: number
  pageSize: number
  totalRecords: number
  result: T[]
}

export interface AdminUser {
  firstName: string
  lastName: string
  emailAddress: string
}

export interface Error {
  errorCode: string
  message: string
  isTransient: boolean
  inner: string
  fullMessage: string
}

export interface ILookUp {
  id: string
  displayName: string
}

export interface INameValue {
  name: string
  value: string
}

export interface IPayableItem {
  organizationId: string
  uniqueRequestId: string
  payableItemModels: PayableItemModel[]
  createdOn: Date
}

export interface PayableItemModel {
  payableItemId: string
  name: string
  code?: string
  currency: string
  currencyCode: string
  description: string
  priceType: string
  price?: any
  priceRange: PriceRange
  vat: Vat
  stampDuty: StampDuty
  gifmisCode: string
  isLocked: boolean
  isPayable?: boolean
  isTaxable?: boolean
  isApproved?: boolean
  organizationId: string
  quantity?: number
  additionalInformation: Record<string, any>
}

export interface PriceRange {
  min: string
  max: string
}

export interface StampDuty {
  fee: string
  isApplyable: boolean
}

export interface Vat {
  fee: number
  type: string
  maximumFee: number
  isApplyable: boolean
}

export interface addition {
  itemStrength: string
  itemInfo: string
  itemHandle: string
  itemSelect: string
  itemDescription: string
}

export interface itemDetail {
  itemName: string
  gifmisCode: string
  itemQty: string
  itemTax: string
  itemPrice: string
  total: string
  currencyCode: string
}

export interface Iinvoice {
  customerName: string
  dueDate: string
  phoneNo: string
  mobileNo: string
  billingAddress: string
  billingNo: string
  date: string
  amount: string
  organizationPhoneNo?: string
  organizationMobileNo?: string
  item: itemDetail[]
}

export interface IOption {
  label: string
  value: string
}

export interface ICustomerRead {
  id: string
  name: string
  phoneNumber: string
  email: string
}

export interface ICustomer {
  id: string
  name: string
  bvn: string
  nin: string
  email: string
  remarks: string
  website: string
  lastName: string
  firstName: string
  cacNumber: string
  companyName: string
  uniqueRequestId: string
  address: Address
  contactPersonName: string
  customerType: string
  phoneNumber: string
  countryCode: string
  billingAddress: BillingAddress
}

export interface Address {
  city: string
  state: string
  street: string
  country: string
  postalCode: string
}

export interface BillingAddress {
  city?: string
  state: string
  street: string
  country: string
  postalCode: string
}

export interface IBill {
  id: string
  note: string
  recurring: Recurring
  billId: string
  customerId: string
  dueDate: string
  billNumber: string
  lineItems: LineItems[]
  organisationId: string
  status?: string
  customerName?: string
  createdOn: string
  customerPhoneNumber?: string
  invoiceCount: number
  priceAdjustments?: PriceAdjustmentModel[]
}

export interface Recurring {
  label: string
  interval: number
  frequency: string
}

export interface LineItems {
  id: string
  tax: ItemTax
  quantity: string
  price: string
}

export interface ItemTax {
  type: string
  value: string
}

export interface Invoice {
  id: string
  tax: string
  status: string
  total: number
  dueDate: string
  subTotal: number
  currency: string
  createdDate: string
  proccesDate: string
  invoiceNumber: string
  priceAdjustments: PriceAdjustmentModel[]
  lineItems: LineItem[]
  amountDue?: number
  amountPaid?: number
  allowPartialPayment?: boolean
}
export interface IBillInvoiceModel {
  billNumber: string
  note: string
  dueDate: string
  customer: ICustomer
  lineItems: LineItem[]
  additionalInformation: {}
  organisation: {
    name: string
    email: string
    address: string
    logoUrl: string
    phoneNumber: string
  }
  invoices: Invoice[]
  status?: string
}

export interface LineItem {
  id: string
  tax: {
    type: string
    value: number
  }
  total: number
  subTotal?: number
  quantity: number
  price: number
  gifmisCode: string
  name: string
  description: string
  additionalInformation?: Record<string, any>
  currency?: string
  priceRange?: PriceRange
}

export enum PriceAdjustmentStatus {
  'OLD' = 'old',
  'NEW' = 'new'
}
export interface PriceAdjustmentModel {
  id?: string
  description?: string
  amount?: string
  type?: string
  status?: PriceAdjustmentStatus
  allowPartialPayment?: boolean
}
export interface IPayableItemActivation {
  uniqueRequestId?: string
  organizationId: string
  payableItemId: string
}
export interface ISearchOrgnisation {
  organizationId: string
  name: string
  code: string
  organizationEmail: string
}

export interface IRole {
  id: string
  name: string
  description?: string
  permissions?: string[]
  uniqueRequestId: string
  displayName?: string
  userCount?: string
}

export interface IPermission {
  code: string
  group: string
  description: string
}

export interface ApiResponse {
  id: string
  name: string
}

export interface IBillingCycle {
  id: string
  defaultFrequncy: number
  frequencies: number[]
  name: string
  value: string
}

export interface IBillingSettings {
  id?: string
  organizationId?: string
  billingRate: number
  currencyCode: string
  billingFrequncy: number
  billingCycle: string
  billingSettingId?: string
  randomStr?: string
}

export interface IBank {
  code: string
  name: string
}

export interface ITsa {
  id?: string
  settingId?: string
  bankName: string
  bankCode: string
  currencyCode: string
  accountNumber: string
  accountName: string
  organizationIds?: string[]
  applicableToAll: boolean
}

export interface ITsaSettings {
  id?: string
  bankName: string
  bankCode: string
  currencyCode: string
  accountNumber: string
  accountName: string
  applicableToAll: boolean
  organizations?: {
    organizationId: string
    organizationName: string
    organizationCode: string
  }[]
}

export interface IListProps<T> {
  columns: IListColumn<T>[]
  data: T[]
  pagination: boolean
  perPage?: number[]
  loading?: boolean
  noItem?: {
    message: string
    icon: string
    buttonName: string
  }
  remotePagination?: (qs: string) => Promise<PaginatedResult<T>>
}

export interface NotificationItem {
  id: string
  userId: string
  status: string
  content: string
  subject: string
  recipientId: string
  recipientType: string
  createdOn: Date
  read: boolean
  isHtml: boolean
}

export interface NotificationInbox {
  notificationInboxId: string
  subject: string
  content: string
  status: string
  createdOn: string
  isHtml: boolean
}

export interface IConfigurationEntry {
  key: string
  value: string
  isSecret: boolean
  isNew?: boolean
}

export interface ISetting {
  settingId?: string
  provider?: string
  configurationEntries: IConfigurationEntry[]
}

export interface IProvider {
  providerId: string
  index: number
}

export interface ResetPassword {
  username: string
  resetCode: string
  newPassword: string
}

export enum ChartType {
  BAR = 'bar',
  PIE = 'pie',
  LINE = 'line',
  DOUGHNUT = 'doughnut'
}

export interface ICollection {
  amount: number
  customerId: string
  currency: string
  time: string
  customerName: string
  invoiceNumber: string
  transactionReference: string
}

export interface IOrganizationReport {
  userCount: number
  payableItemCount: number
  subOrganizationCount: number
}

export interface IFilterReport {
  currency?: string
  duration?: string
  startDate?: string
  endDate?: string
}

export interface ICollectionTrend {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    maxBarThickness?: number
    backgroundColor?: string | string[]
    borderColor?: string
    tension?: number
    color?: string
  }[]
}

export enum DURATION {
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  MONTHLY = 'Monthly'
}

export enum FilterMethod {
  Today = 'Today',
  ThisWeek = 'This Week',
  Last30Days = 'Last 30 Days',
  ThisMonth = 'This Month',
  Last90Days = 'Last 90 Days',
  ThisYear = 'This Year',
  CustomDate = 'Custom Date'
}

export interface IBalance {
  id: string
  accountNumber: string
  accountName: string
  bankName: string
  balance: string
  createdOn: string
}

export interface IGifmis {
  id: string
  code: string
  description: string
  name?: string
  accountType?: string
  limit: string
  createdOn: string
}

export enum CombineLogic {
  AND = 'AND',
  OR = 'OR'
}

export interface IIntegrator {
  id: string
  uniqueRequestId?: string
  name?: string
  email: string
  phoneNumber?: string
  integratorType: string
  isLive?: string
  countryCode?: string
  createdOn?: Date
  callbackUrl: string
}

export interface IKey {
  id: string
  uniqueRequestId?: string
  name: string
  callbackUrl?: string
  allowedIps?: string[]
  allowedIPs: string[]
  permissions?: string[]
  isLive?: string
  publicKey?: string
  secretKey?: string
  allowedPermissions?: string[]
  disallowedPermissions?: string[]
  integratorId?: string
}

export interface IData {
  [entity: string]: {
    permissions?: IKeyPermissions[]
  }
}

export interface IKeyPermissions {
  code: string
  description: string
}

export interface IKeyPermit {
  [entity: string]: {
    allowedPermissions?: allowedPermissions[]
    disallowedPermissions?: disallowedPermissions[]
  }
}

export interface allowedPermissions {
  code: string
  description: string
}

export interface disallowedPermissions {
  code: string
  description: string
}

export interface IAccount {
  bankCode?: string
  accountNumber?: string
  otherNames?: string
  surname?: string
  value?: object
  balance?: string
}
export interface IProfile {
  organizationId: string
  organizationAdminUserId: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  jobTitle?: string
  jobRole?: string
}
export interface IChangePassword {
  newPassword: string
  currentPassword: string
  confirmPassword: string
}
