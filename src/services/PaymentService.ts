import { BaseService } from './BaseService'
import type { ISetting, RootAPIResponse } from './types'

class PaymentService extends BaseService {
  constructor() {
    super('payments')
  }
  //payment settlement settings endpoint
  readonly createSettlementSetting = async (data: Partial<ISetting>) => {
    const url = this.getUrl('settings/settlement')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }
  readonly updateSettlementSetting = async (data: Partial<ISetting>) => {
    const url = this.getUrl('settings/settlement')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'PUT',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }
  readonly getSettlementSettings = async () => {
    const url = this.getUrl('settings/settlement')
    const response = await this.doRequest<RootAPIResponse<ISetting[]>>({
      url,
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value
  }
  readonly deleteSettlementSetting = async (settingId: string) => {
    const url = this.getUrl(`settings/settlement/${settingId}`)
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'DELETE',
      options: {}
    })
    return response.value
  }
  //payment gateway settings endpoint
  readonly createGatewaySetting = async (data: Partial<ISetting>) => {
    const url = this.getUrl('settings/gateway')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }
  readonly updateGatewaytSetting = async (data: Partial<ISetting>) => {
    const url = this.getUrl('settings/gateway')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'PUT',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }
  readonly getGatewaySettings = async () => {
    const url = this.getUrl('settings/gateway')
    const response = await this.doRequest<RootAPIResponse<ISetting[]>>({
      url,
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value
  }
  readonly deleteGatewaySetting = async (settingId: string) => {
    const url = this.getUrl(`settings/gateway/${settingId}`)
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'DELETE',
      options: {}
    })
    return response.value
  }
}

export default new PaymentService()
