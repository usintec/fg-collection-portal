import { BaseService } from './BaseService'
import type { RootAPIResponse, IRole } from './types'

class RoleService extends BaseService {
  constructor() {
    super('roles')
  }

  readonly create = async (data: Partial<IRole>) => {
    const response = await this.doRequest<RootAPIResponse<IRole>>({
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response
  }

  readonly getAll = async (): Promise<IRole[]> => {
    const response = await this.doRequest<RootAPIResponse<IRole[]>>()
    return response.value
  }

  readonly getOne = async (id: string): Promise<IRole> => {
    const url = this.getUrl(`${id}`)
    const res = await this.doRequest<RootAPIResponse<IRole>>({
      url
    })
    return res.value
  }

  readonly update = async (id: string, body: Partial<IRole>): Promise<IRole> => {
    const url = this.getUrl(`${id}`)
    const response = await this.doRequest<RootAPIResponse<IRole>>({
      url,
      method: 'PUT',
      body
    })
    return response.value
  }

  readonly delete = async (id: string, body: Partial<IRole>): Promise<IRole> => {
    const url = this.getUrl(`${id}`)
    const response = await this.doRequest<RootAPIResponse<IRole>>({
      url,
      method: 'DELETE',
      body
    })
    return response.value
  }
}

export default new RoleService()
