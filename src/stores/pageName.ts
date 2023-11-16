import { defineStore } from 'pinia'

export const usePageNameStore = defineStore('pageName', {
  state: () => ({
    pageName: 'Dashboard',
    _goBack: false,
    subMenu: false,
    subMenuId: ''
  }),
  actions: {
    setPageName(pageName: string) {
      this.pageName = pageName
      document.title = pageName
    },
    goBack() {
      this._goBack = !this._goBack
      this.subMenu = false
    },
    turnOffSubMenu() {
      this.subMenu = false
    },
    turnONSubMenu() {
      this.subMenu = true
    },
    setSubMenu(subMenu: string) {
      this.subMenu = true
      this.pageName = subMenu
    },
    setSubMenuId(subMenuId: string) {
      this.subMenuId = subMenuId
    }
  }
})
