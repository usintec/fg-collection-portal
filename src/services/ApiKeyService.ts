import { BaseService } from './BaseService'
import type { IKey, RootAPIResponse, IData, IKeyPermit } from './types'
type Key = IKey
type data = IData
type permit = IKeyPermit

class ApiKeyService extends BaseService {
  constructor() {
    super('apiKeys')
  }

  readonly regenerate = async (id: string): Promise<Key> => {
    const url = this.getUrl(`${id}/regenerate`)
    const res = await this.doRequest<RootAPIResponse<Key>>({
      method: 'POST',
      url
    })
    return res.value
  }

  readonly getKeyPermission = async (id: string): Promise<permit[]> => {
    const url = this.getUrl(`${id}/permissions`)
    const res = await this.doRequest<RootAPIResponse<permit[]>>({
      url
    })
    return res.value
  }

  readonly getOne = async (id: string): Promise<Key> => {
    const url = this.getUrl(id)
    const res = await this.doRequest<RootAPIResponse<Key>>({
      url
    })
    return res.value
  }

  readonly getAll = async () => {
    const url = this.getUrl('/permissions')
    const response = await this.doRequest<RootAPIResponse<data[]>>({
      url
    })
    return response.value
  }

  readonly editKey = async (id: string, body: Partial<Key>): Promise<Key> => {
    const url = this.getUrl(`${id}`)
    const res = await this.doRequest<RootAPIResponse<Key>>({
      method: 'PUT',
      url,
      body
    })
    return res.value
  }
}

export default new ApiKeyService()
