import { defineStore } from 'pinia'
import type { IUserInfo, ICustomer } from '@/services/types'

interface State {
  user: IUserInfo | undefined
  users: IUserInfo[]
  userDetails: ICustomer | undefined
}
export const useUserStore = defineStore('user', {
  state: () =>
    ({
      user: undefined as IUserInfo | undefined,
      users: [],
      userDetails: JSON.parse(localStorage.getItem('userDetails') || '{}') as ICustomer | undefined
    } as State),
  actions: {
    setUser(user: IUserInfo) {
      this.user = user
    },
    getUserId() {
      return this.user?.userId
    },
    clearUser() {
      this.user = undefined
    },
    setUserDetails(userDetails: ICustomer) {
      this.userDetails = userDetails
      localStorage.setItem('userDetails', JSON.stringify(userDetails))
    },
    clearUserDetails() {
      this.userDetails = undefined
      localStorage.removeItem('userDetails')
    }
  }
})
