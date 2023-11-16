import { defineStore } from 'pinia'
import type { IOrganization } from '@/services/types'

interface IState {
  organization?: IOrganization
  organizationStack?: IOrganization[]
  activeOrganization?: IOrganization
  fg_id?: string
}

export const useOrganizationStore = defineStore('organization', {
  state: () =>
    ({
      activeOrganization: undefined,
      organizationStack: [],
      fg_id: undefined
    } as IState),
  actions: {
    addToOrganizationStack(organization?: IOrganization) {
      if (organization) this.organizationStack?.push(organization)
    },
    updateOrganizationStack(orgId: string) {
      this.fg_id = orgId
      if (this.organizationStack && this.organizationStack.length > 0) {
        const index = this.organizationStack?.findIndex(
          (organization) => organization.organizationId == orgId
        )
        if (index && index > 0) {
          this.organizationStack = this.organizationStack?.slice(0, index + 1)
          this.activeOrganization = this.organizationStack[index]
        } else if (index == 0) {
          this.organizationStack = [this.organizationStack[0]]
          this.activeOrganization = this.organizationStack[0]
        }
      }
    },
    setActiveOrganization(organization?: IOrganization) {
      this.fg_id = organization?.organizationId
      this.activeOrganization = organization
    },
    clearOrganization() {
      this.organization = undefined
    },
    setFgId(id: string) {
      this.fg_id = id
    }
  }
})
