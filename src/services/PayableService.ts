import { BaseService } from './BaseService'
import type {
  IPayableItem,
  PaginatedResult,
  PayableItemModel,
  RootAPIResponse,
  IPayableItemActivation
} from './types'

interface SearchResult {
  name: string
}
class PayableItemService extends BaseService {
  constructor() {
    super('organizations')
  }

  readonly create = (data: Partial<IPayableItem>) => {
    const url = this.getUrl('setUpPaybleItems')
    return this.doRequest({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
  }
  readonly getAll = async (orgId: string): Promise<PayableItemModel[]> => {
    const url = this.getUrl(orgId, 'payableItems')
    const res = await this.doRequest<RootAPIResponse<PaginatedResult<PayableItemModel>>>({
      url
    })
    return res.value.result
  }

  readonly searchCode = async (code: string): Promise<SearchResult> => {
    const url = this.getUrl('gifmisSearch')
    const res = await this.doRequest<RootAPIResponse<SearchResult>>({
      url,
      method: 'POST',
      body: { code }
    })
    return res.value
  }

  readonly payableItemById = async (
    id: string | null,
    organizationId: string | null
  ): Promise<PayableItemModel> => {
    const url = this.getUrl(`${organizationId}/payableitems/${id}`)
    const res = await this.doRequest<RootAPIResponse<PayableItemModel>>({
      url
    })
    return res.value
  }
  readonly update = (data: Partial<PayableItemModel>) => {
    const url = this.getUrl('payableitems')
    return this.doRequest({
      url,
      method: 'PUT',
      body: this.uniqueRequestGUID(data)
    })
  }
  readonly activate = (data: Partial<IPayableItemActivation>) => {
    const url = this.getUrl('payableitems/activate')
    return this.doRequest({
      url,
      method: 'PATCH',
      body: this.uniqueRequestGUID(data)
    })
  }
  readonly deactivate = (data: Partial<IPayableItemActivation>) => {
    const url = this.getUrl('payableitems/deactivate')
    return this.doRequest({
      url,
      method: 'PATCH',
      body: this.uniqueRequestGUID(data)
    })
  }
}

export default new PayableItemService()
