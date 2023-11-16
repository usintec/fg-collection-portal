import axios from 'axios'
import EnvironmentLoader from './EnvironmentLoader'
import type { ILoginResponse } from './types'
class UpdateToken {
  private refreshToken: string
  private token: string
  private expTime: number
  private lastLogin: Date

  constructor() {
    this.refreshToken = localStorage.getItem('refreshToken') ?? ''
    this.token = localStorage.getItem('token') ?? ''
    this.expTime = Number(localStorage.getItem('expTime')) ?? 0
    this.lastLogin = new Date(Number(localStorage.getItem('lastLogin')) ?? Date.now())
  }

  readonly updateToken = async (): Promise<string> => {
    if (this.isExpired()) {
      try {
        const newToken = await this.getNewToken()
        this.setToken(newToken)
      } catch (error) {
        localStorage.clear()
        window.location.reload()
      }
    }
    return this.token
  }

  readonly saveToken = (token: ILoginResponse) => {
    this.token = token.access_token
    this.refreshToken = token.refresh_token
    this.expTime = Date.now() + token.expires_in * 1000
    localStorage.setItem('token', this.token)
    localStorage.setItem('refreshToken', this.refreshToken)
    localStorage.setItem('expTime', this.expTime.toString())
    localStorage.setItem('lastLogin', Date.now().toString())
  }

  readonly getLastLogin = () => this.lastLogin

  private isExpired = (): boolean => {
    return true || this.expTime < Date.now() // TODO: Menasi Fix this
  }

  private getNewToken = async (): Promise<string> => {
    const baseUrl = EnvironmentLoader.getConfig().baseUrl
    const url = `${baseUrl}/connect/token`
    const body = new URLSearchParams()
    body.append('grant_type', 'refresh_token')
    body.append('refresh_token', this.refreshToken)
    body.append('client_id', 'revassure.admin')
    const response = await axios.post(url, body, {
      headers: {
        'X-TENANT': EnvironmentLoader.getConfig().tenant.toLowerCase()
      }
    })
    localStorage.setItem('refreshToken', response.data.refresh_token)
    return response.data.access_token
  }

  private setToken = (newToken: string) => {
    const expTime = Date.now() + 60 * 60 * 1000
    localStorage.setItem('token', newToken)
    localStorage.setItem('expTime', expTime.toString())
  }
}

export default new UpdateToken()
