import type { IEnvironmentConfig } from './types'

export const localHostConfig: IEnvironmentConfig = {
  host: 'localhost:5173',
  client_id: 'revassure.admin',
  grant_type: 'password',
  baseUrl: 'https://api.normsmiway.com/revassure',
  tenant: 'Admin'
}
