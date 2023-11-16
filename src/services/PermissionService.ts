import { BaseService } from './BaseService'
import type { RootAPIResponse, IPermission } from './types'

class PermissionService extends BaseService {
  constructor() {
    super('permissions')
  }

  readonly getAll = async () => {
    const response = await this.doRequest<RootAPIResponse<IPermission[]>>()
    return response.value
  }

  readonly getPermissions = async (id: string): Promise<IPermission> => {
    const url = this.getUrl(`allowed/${id}`)
    const res = await this.doRequest<RootAPIResponse<IPermission>>({
      url
    })
    return res.value
  }

  readonly getDisallowedPermissions = async (id: string): Promise<IPermission> => {
    const url = this.getUrl(`disallowed/${id}`)
    const res = await this.doRequest<RootAPIResponse<IPermission>>({
      url
    })
    return res.value
  }
}

export default new PermissionService()
