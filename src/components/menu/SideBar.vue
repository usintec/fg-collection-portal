<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import SideBarMenuItem from './SideBarMenuItem.vue'
import type { IMenu } from './types'
import { usePageNameStore } from '@/stores/pageName'
import { useRouter } from 'vue-router'
import SideSubMenu from './SideSubMenu.vue'
import { menuItems, sendMenus, logout } from './menus'
import CheckPermission from '../permission/CheckPermission.vue'

const pageStore = usePageNameStore()

const router = useRouter()
const activeMenu = ref<IMenu>(menuItems[0])
const showSubMenu = ref(false)

const getMenu = (_path: string): IMenu => {
  const path = _path.split('/')[1]
  const menu = [...menuItems, ...sendMenus].find((menu) => menu.link === `/${path}`)
  return menu ?? menuItems[0]
}

onMounted(() => {
  activeMenu.value = getMenu(router.currentRoute.value.path)
})

watch(
  () => router.currentRoute.value.path,
  (path) => (activeMenu.value = getMenu(path))
)

const onClick = (menu: IMenu) => {
  activeMenu.value = menu
  pageStore.setPageName(menu.label)
  pageStore.setSubMenuId('')
  pageStore.turnOffSubMenu()
  router.push(menu.link)
}

const localStorage = () => {
  window.localStorage.clear()
  window.location.reload()
}

watch(
  () => pageStore.subMenuId,
  () => {
    if (pageStore.subMenuId) {
      showSubMenu.value = activeMenu.value.label === pageStore.subMenuId
    } else {
      showSubMenu.value = false
    }
  }
)
</script>
<template>
  <div class="h-screen w-[277px] relative flex flex-col bg-dark_green">
    <div
      @click="
        () => {
          router.push('/')
        }
      "
      class="bg-[#6B97B0] w-2/3 rounded-md mt-4 p-3 ml-[31px]"
    >
      <span class="rounded bg-[#99C4DC] p-1 text-white">LOGO</span>
    </div>
    <div class="flex flex-col gap-2 my-5">
      <CheckPermission
        :permission="menu.permission ?? []"
        :pass="menu.permission === undefined"
        :key="menu.label"
        v-for="menu of menuItems"
      >
        <SideBarMenuItem :active="activeMenu.link === menu.link" :menu="menu" :clicked="onClick" />
      </CheckPermission>
    </div>
    <span class="h-[1px] w-[90%] bg-[#446B82]"></span>
    <CheckPermission
      :permission="menu.permission ?? []"
      :pass="menu.permission === undefined"
      :key="menu.label"
      v-for="menu of sendMenus"
    >
      <SideBarMenuItem
        class="mt-5"
        :active="activeMenu.link === menu.link"
        :key="menu.label"
        :menu="menu"
        :clicked="onClick"
      />
    </CheckPermission>
    <SideBarMenuItem
      class="mt-auto mb-4"
      :active="activeMenu.icon === logout.icon"
      :menu="logout"
      :clicked="localStorage"
    />
    <SideSubMenu
      class="absolute right-0 bg-dark_green mt-20"
      v-if="showSubMenu || (activeMenu.subMenu && activeMenu.showSubMenuOnClick)"
      :parent="activeMenu"
      :subMenu="activeMenu.subMenu ?? []"
    />
  </div>
</template>
