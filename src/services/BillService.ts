import { BaseService } from './BaseService'
import type {
  IBill,
  RootAPIResponse,
  PaginatedResult,
  IBillInvoiceModel,
  PayableItemModel
} from './types'
type BillType = IBill
class BillService extends BaseService {
  constructor() {
    super('bills')
  }

  readonly getAll = async (): Promise<BillType[]> => {
    const response = await this.doRequest<RootAPIResponse<PaginatedResult<BillType>>>()
    return response.value.result
  }

  readonly create = async (body: Partial<IBill>, preview = false): Promise<BillType> => {
    const url = this.getUrl(`?preview=${preview}`)
    const response = await this.doRequest<RootAPIResponse<BillType>>({
      url,
      method: 'POST',
      body
    })
    return response.value
  }

  readonly billById = async (id: string): Promise<IBillInvoiceModel> => {
    const url = this.getUrl(`/${id}`)
    const res = await this.doRequest<RootAPIResponse<IBillInvoiceModel>>({
      url
    })
    return res.value
  }

  readonly update = async (id: string, body: Partial<IBill>): Promise<BillType> => {
    const url = this.getUrl(`${id}`)
    const response = await this.doRequest<RootAPIResponse<BillType>>({
      url,
      method: 'PUT',
      body
    })
    return response.value
  }

  readonly searchPayableItem = async (
    orgId: string,
    searchTerm: string
  ): Promise<PayableItemModel[]> => {
    const url = this.getUrl(orgId, 'payableItems', 'search')
    const res = await this.doRequest<RootAPIResponse<PayableItemModel[]>>({
      url,
      method: 'POST',
      body: { searchTerm }
    })
    return res.value
  }

  readonly generateBillId = async (): Promise<string> => {
    const url = this.getUrl(`/generate-bill-number`)
    const res = await this.doRequest<RootAPIResponse<{ billNumber: string }>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID({})
    })
    return res.value.billNumber
  }
  readonly submitBill = async (billId: string): Promise<{ billStatus: string }> => {
    const url = this.getUrl(`/${billId}/complete`)
    const res = await this.doRequest<RootAPIResponse<{ billStatus: string }>>({
      url,
      method: 'PATCH',
      body: this.uniqueRequestGUID({})
    })
    return res.value
  }
}

export default new BillService()
