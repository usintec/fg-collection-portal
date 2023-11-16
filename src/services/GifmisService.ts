import { BaseService } from './BaseService'
import type { PaginatedResult, RootAPIResponse } from './types'

class GifmisService extends BaseService {
  constructor() {
    super('gifmis')
  }

  readonly getGifmisData = async <T>(qs: string): Promise<PaginatedResult<T>> => {
    const url = this.getUrl(qs)
    const response = await this.doRequest<RootAPIResponse<PaginatedResult<T>>>({
      url,
      method: 'GET'
    })
    return response.value
  }

  readonly bulkUpload = async <T>(file: File): Promise<RootAPIResponse<T>> => {
    const formData = new FormData()
    const url = this.getUrl('bulk', 'upload')
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
}

export default new GifmisService()
