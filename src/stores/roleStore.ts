import { defineStore } from 'pinia'
import type { IRole, IPermission } from '@/services/types'

interface State {
  role: IRole[] | undefined
  permission: IPermission | null
  dispermission: IPermission | null
  roleOne: IRole | undefined
}

export const useRoleStore = defineStore('role', {
  state: () =>
    ({
      role: JSON.parse(localStorage.getItem('role') || '{}') as IRole | undefined,
      permission: JSON.parse(localStorage.getItem('permission') || '{}') as IPermission | null,
      dispermission: JSON.parse(
        localStorage.getItem('dispermission') || '{}'
      ) as IPermission | null,
      roleOne: JSON.parse(localStorage.getItem('roleOne') || '{}') as IRole | undefined
    } as State),

  actions: {
    setRole(role: IRole[]) {
      this.role = role
      localStorage.setItem('role', JSON.stringify(role))
    },

    setRoleOne(roleOne: IRole) {
      this.roleOne = roleOne
      localStorage.setItem('roleOne', JSON.stringify(roleOne))
    },

    setPermission(permission: IPermission) {
      this.permission = permission
      localStorage.setItem('permission', JSON.stringify(permission))
    },

    setDisPermission(dispermission: IPermission) {
      this.dispermission = dispermission
      localStorage.setItem('dispermission', JSON.stringify(dispermission))
    }
  }
})
