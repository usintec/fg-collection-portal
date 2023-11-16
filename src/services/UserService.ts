import { BaseService } from './BaseService'
import type {
  IPermission,
  RootAPIResponse,
  IAdminUser,
  ResetPassword,
  IChangePassword
} from './types'

class UserService extends BaseService {
  constructor() {
    super('users')
  }

  readonly getUserPermissions = async (id: string): Promise<IPermission> => {
    const url = this.getUrl(`${id}/permissions`)
    const res = await this.doRequest<RootAPIResponse<IPermission>>({
      url
    })
    return res.value
  }

  readonly update = async (id: string, body: Partial<IAdminUser>): Promise<IAdminUser> => {
    const url = this.getUrl(`${id}/roleAndPermissions`)
    const response = await this.doRequest<RootAPIResponse<IAdminUser>>({
      url,
      method: 'PUT',
      body
    })
    return response.value
  }

  readonly requestPassword = async (userName: string): Promise<void> => {
    await this.doRequest({
      url: this.getUrl('forget-password'),
      method: 'POST',
      body: this.uniqueRequestGUID({ userName }),
      options: {
        noToken: true
      }
    })
  }

  readonly resetPassword = async (reset: ResetPassword): Promise<void> => {
    await this.doRequest({
      url: this.getUrl('reset-password'),
      method: 'POST',
      body: this.uniqueRequestGUID(reset),
      options: {
        noToken: true
      }
    })
  }
  readonly changePassword = async (data: Partial<IChangePassword>) => {
    const url = this.getUrl('change-password')
    const response = await this.doRequest<RootAPIResponse<{}>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response
  }
}

export default new UserService()
