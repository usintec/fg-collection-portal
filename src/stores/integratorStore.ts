import { defineStore } from 'pinia'
import type { IIntegrator } from '@/services/types'

interface IState {
  integrator?: IIntegrator
  integratorStack?: IIntegrator[]
  activeIntegrator?: IIntegrator
  id?: string
}

export const useIntegratorStore = defineStore('integrator', {
  state: () =>
    ({
      activeIntegrator: undefined,
      integratorStack: [],
      id: undefined
    } as IState),
  actions: {
    addToIntegratorStack(integrator?: IIntegrator) {
      if (integrator) this.integratorStack?.push(integrator)
    },
    setActiveOrganization(integrator?: IIntegrator) {
      this.id = integrator?.id
      this.activeIntegrator = integrator
    },
    clearOrganization() {
      this.integrator = undefined
    }
  }
})
