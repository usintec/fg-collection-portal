import { BaseService } from './BaseService'
import type {
  IOrganization,
  PaginatedResult,
  RootAPIResponse,
  ILookUp,
  IAdminUser,
  ICreateAdmin,
  ISearchOrgnisation,
  IBillingCycle,
  IBillingSettings,
  ITsa,
  ITsaSettings,
  ICustomer,
  IProfile
} from './types'
type ItemType = IOrganization
type CustomerType = ICustomer
interface ICreateRes {
  organizationId: string
}
class OrganizationService extends BaseService {
  constructor() {
    super('organizations')
  }

  readonly create = async (data: Partial<ItemType>) => {
    const url = this.getUrl('createOrganization')
    const response = await this.doRequest<RootAPIResponse<ICreateRes>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response
  }

  readonly getOne = async (id: string): Promise<ItemType> => {
    const url = this.getUrl(id)
    const res = await this.doRequest<RootAPIResponse<ItemType>>({
      url
    })
    return res.value
  }

  readonly getAll = async (): Promise<ItemType[]> => {
    const response = await this.doRequest<RootAPIResponse<PaginatedResult<ItemType>>>()
    return response.value.result
  }

  readonly getAllSubOrganizations = async (id: string): Promise<ItemType[]> => {
    const url = this.getUrl(`subOrganizations/${id}`)
    const response = await this.doRequest<RootAPIResponse<PaginatedResult<ItemType>>>({
      url
    })
    return response.value.result
  }

  readonly getParentOrg = async (): Promise<ILookUp[]> => {
    const url = this.getUrl('lookup')
    const response = await this.doRequest<RootAPIResponse<ILookUp[]>>({
      url
    })
    return response.value
  }

  readonly update = async (data: Partial<ItemType>) => {
    const url = this.getUrl('updateOrganization')
    const response = await this.doRequest<RootAPIResponse<ICreateRes>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response
  }

  readonly getAdminUsers = async (id: string): Promise<IAdminUser[]> => {
    const url = this.getUrl(`${id}/getAdminUsers`)
    const res = await this.doRequest<RootAPIResponse<PaginatedResult<IAdminUser>>>({
      url
    })
    return res.value.result
  }

  readonly createAdminUser = async (data: ICreateAdmin) => {
    const url = this.getUrl('createAdmin')
    const response = await this.doRequest<RootAPIResponse<ICreateRes>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response
  }
  readonly searchOrganisation = async (searchTerm: string) => {
    const url = this.getUrl(`organizations/search?SearchTerm=${searchTerm}`)
    const response = await this.doRequest<RootAPIResponse<ISearchOrgnisation[]>>({
      url,
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly billingLookup = async () => {
    const url = this.getUrl('settings/billing/lookup')
    const response = await this.doRequest<RootAPIResponse<IBillingCycle[]>>({
      url,
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly createBillingSetting = async (data: Partial<IBillingSettings>) => {
    const url = this.getUrl('settings/billing')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }

  readonly createTsaSetting = async (data: Partial<ITsa>) => {
    const url = this.getUrl('settings/tsa')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }

  readonly getBillingSettings = async () => {
    const url = this.getUrl('settings/billing')
    const response = await this.doRequest<RootAPIResponse<IBillingSettings[]>>({
      url,
      method: 'GET',
      options: {}
    })
    return response.value
  }

  readonly getTsaSettings = async () => {
    const url = this.getUrl('settings/tsa')
    const response = await this.doRequest<RootAPIResponse<ITsaSettings[]>>({
      url,
      method: 'GET',
      options: {}
    })
    return response.value
  }

  readonly updateBillingSetting = async (data: Partial<IBillingSettings>) => {
    const url = this.getUrl('settings/billing')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'PUT',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }

  readonly deleteBillSetting = async (settingId: string) => {
    const url = this.getUrl(`settings/billing/${settingId}`)
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'DELETE',
      options: {}
    })
    return response.value
  }

  readonly updateTsaSetting = async (data: Partial<ITsa>) => {
    const url = this.getUrl('settings/tsa')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'PUT',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }

  readonly deleteTsaSettings = async (settingId: string) => {
    const url = this.getUrl(`settings/tsa/${settingId}`)
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'DELETE',
      options: {}
    })
    return response.value
  }

  readonly customercreate = async (data: Partial<CustomerType>) => {
    const url = this.getUrl('customers')
    const response = await this.doRequest<RootAPIResponse<CustomerType>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response
  }

  readonly setuporg = async (data: Partial<ItemType>) => {
    const url = this.getUrl('setupOrganization')
    const response = await this.doRequest<RootAPIResponse<ICreateRes>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data),
      options: {
        noToken: true
      }
    })
    return response
  }

  readonly logoUpload = async <T>(file: File): Promise<RootAPIResponse<T>> => {
    const formData = new FormData()
    const url = this.getUrl('upload', 'logo')
    formData.append('file', file)
    const response = await this.doRequest<RootAPIResponse<T>>({
      url,
      method: 'POST',
      body: formData,
      options: {
        contentType: 'multipart/form-data'
      }
    })
    return response
  }
  readonly updateUserProfile = async (data: Partial<IProfile>) => {
    const url = this.getUrl('updateadminuser')
    const response = await this.doRequest<RootAPIResponse<{ organizationAdminUserId: string }>>({
      url,
      method: 'PUT',
      body: this.uniqueRequestGUID({ ...data, phoneNumber: data.phone })
    })
    return response.value
  }
}

export default new OrganizationService()
