import EnvironmentLoader from './EnvironmentLoader'
import axios from 'axios'
import UpdateToken from './UpdateToken'
import { useToast } from 'vue-toastification'
import type { ErrorMessage } from './types'

export class BaseService {
  private basePath: string
  private toast = useToast()

  constructor(basePath: string) {
    this.basePath = basePath
  }

  protected getUrl = (...paths: (string | number)[]) => {
    return [this.getBaseUrl(), this.basePath, ...paths].join('/')
  }

  private guid = () => {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`
  }

  protected uniqueRequestGUID = (d: Record<string, any>) => {
    return { ...d, uniqueRequestId: this.guid() }
  }

  private getBaseUrl = () => {
    return EnvironmentLoader.getConfig().baseUrl
  }

  protected doRequest = async <T = any>(
    {
      url,
      method,
      body,
      options
    }: {
      url?: string
      method?: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH'
      body?: any
      options?: {
        text?: boolean
        contentType?: string
        noToken?: boolean
      }
    } = { method: 'GET' }
  ) => {
    let tmpUrl = url
    let token = ''
    if (!tmpUrl) tmpUrl = this.getUrl()
    if (!options?.noToken) {
      token = await UpdateToken.updateToken()
    }
    return axios({
      url: tmpUrl,
      method,
      data: body,
      headers: {
        'Content-Type': options?.contentType ?? 'application/json',
        'X-TENANT': EnvironmentLoader.getConfig().tenant,
        Authorization: `Bearer ${token}`
      },
      responseType: options?.text ? 'text' : 'json'
    })
      .then((response) => {
        return response.data as T
      })
      .catch((error) => {
        if (error.response.status === 403 || EnvironmentLoader.isProd()) {
          throw error
        }
        const err: ErrorMessage = error.response.data
        this.toast.error(err.message)

        for (const e of err.errors.generalErrors) {
          this.toast.error(e)
        }

        throw error
      })
  }
}
