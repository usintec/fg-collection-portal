import { BaseService } from './BaseService'
import type { IBank, INameValue, Recurring, RootAPIResponse } from './types'

class LookupService extends BaseService {
  constructor() {
    super('lookups')
  }

  readonly vatTypes = async (): Promise<INameValue[]> => {
    const url = this.getUrl('vat-types')
    const response = await this.doRequest<RootAPIResponse<INameValue[]>>({
      url
    })
    return response.value
  }

  readonly currencies = async (): Promise<INameValue[]> => {
    const url = this.getUrl('currencies')
    const response = await this.doRequest<RootAPIResponse<INameValue[]>>({
      url
    })
    return response.value
  }
  readonly cites = async (state?: string): Promise<string[]> => {
    const url = this.getUrl(state ? `cities?state=${state}` : 'cities')
    const response = await this.doRequest<RootAPIResponse<string[]>>({
      url
    })
    return response.value
  }
  readonly states = async (): Promise<string[]> => {
    const url = this.getUrl('states')
    const response = await this.doRequest<RootAPIResponse<string[]>>({
      url
    })
    return response.value
  }

  readonly billFrequency = async (): Promise<Recurring[]> => {
    const url = this.getUrl('billing-frequency')
    const response = await this.doRequest<RootAPIResponse<INameValue[]>>({
      url
    })
    return response.value.map((c) => ({
      label: c.value,
      interval: 0,
      frequency: c.name
    }))
  }
  readonly billingTypes = async (): Promise<INameValue[]> => {
    const url = this.getUrl('billing-types')
    const response = await this.doRequest<RootAPIResponse<INameValue[]>>({
      url
    })
    return response.value
  }

  readonly dailcode = async (): Promise<Record<string, string>[]> => {
    const url = this.getUrl('dail-code')
    const response = await this.doRequest<RootAPIResponse<Record<string, string>[]>>({
      url
    })
    return response.value
  }

  readonly currency = async (): Promise<string[]> => {
    const url = this.getUrl('currencies')
    const response = await this.doRequest<RootAPIResponse<string[]>>({
      url
    })
    return response.value
  }

  readonly bank = async (): Promise<IBank[]> => {
    const url = this.getUrl('banks')
    const response = await this.doRequest<RootAPIResponse<IBank[]>>({
      url
    })
    return response.value
  }

  readonly citesNoToken = async (state?: string): Promise<string[]> => {
    const url = this.getUrl(state ? `cities?state=${state}` : 'cities')
    const response = await this.doRequest<RootAPIResponse<string[]>>({
      url,
      options: {
        noToken: true
      }
    })
    return response.value
  }

  readonly statesNoToken = async (): Promise<string[]> => {
    const url = this.getUrl('states')
    const response = await this.doRequest<RootAPIResponse<string[]>>({
      url,
      options: {
        noToken: true
      }
    })
    return response.value
  }
}

export default new LookupService()
