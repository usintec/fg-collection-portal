import { BaseService } from './BaseService'
import type { IAccount, RootAPIResponse } from './types'
type ItemType = IAccount

class IntegrationsService extends BaseService {
  constructor() {
    super('integrations')
  }

  readonly accountInfoLookup = async (data: Partial<ItemType>) => {
    const url = this.getUrl(`/accounts/accountInformation`)
    const response = await this.doRequest<RootAPIResponse<ItemType>>({
      method: 'POST',
      url,
      body: this.uniqueRequestGUID(data)
    })
    return response
  }

  readonly accountBalanceLookup = async (data: Partial<ItemType>) => {
    const url = this.getUrl(`/accounts/accountBalance`)
    const response = await this.doRequest<RootAPIResponse<ItemType>>({
      method: 'POST',
      url,
      body: this.uniqueRequestGUID(data)
    })
    return response
  }
}

export default new IntegrationsService()
