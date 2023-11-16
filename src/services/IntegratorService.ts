import { BaseService } from './BaseService'
import type { IIntegrator, IKey, PaginatedResult, RootAPIResponse } from './types'
type ItemType = IIntegrator
type Key = IKey

class IntegratorService extends BaseService {
  constructor() {
    super('integrators')
  }

  readonly create = async (data: Partial<ItemType>) => {
    const response = await this.doRequest<RootAPIResponse<ItemType>>({
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

  readonly createKey = async (id: string, body: Partial<Key>): Promise<Key> => {
    const url = this.getUrl(`${id}/apiKeys`)
    const res = await this.doRequest<RootAPIResponse<Key>>({
      method: 'POST',
      url,
      body
    })
    return res.value
  }

  readonly getKey = async (id: string): Promise<Key[]> => {
    const url = this.getUrl(`${id}/apiKeys`)
    const res = await this.doRequest<RootAPIResponse<Key[]>>({
      url
    })
    return res.value
  }
}

export default new IntegratorService()
