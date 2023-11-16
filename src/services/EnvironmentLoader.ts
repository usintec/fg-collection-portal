import { localHostConfig } from '@/config/environments/localhost'
import { netlifyConfig } from '@/config/environments/netlify'
import { type IEnvironmentConfig } from '@/config/environments/types'

export const envMap: { [host: string]: IEnvironmentConfig } = {
  [localHostConfig.host]: localHostConfig,
  [netlifyConfig.host]: netlifyConfig
}

class EnvironmentLoader {
  private config!: IEnvironmentConfig

  constructor() {
    this.initializeEnvironment(window.location.host)
  }

  public readonly initializeEnvironment = (host: string) => {
    const selectedEnvironmentConfig = envMap[host]
    if (!selectedEnvironmentConfig) {
      throw new Error(`No config found for host: ${host}`)
    }
    this.config = selectedEnvironmentConfig
  }

  public readonly getConfig = () => this.config

  public readonly isProd = () => this.config.host !== localHostConfig.host
}

export default new EnvironmentLoader()
