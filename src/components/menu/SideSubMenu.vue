<script setup lang="ts">
import { useRouter } from 'vue-router'
import MaterialIcon from '../icon/MaterialIcon.vue'
import type { IMenu, SubMenu } from './types'
import { ref } from 'vue'
import { usePageNameStore } from '@/stores/pageName'
import CheckPermission from '../permission/CheckPermission.vue'

interface ISubMenuProps {
  parent: IMenu
  subMenu: (string | SubMenu)[]
}
const menuStore = usePageNameStore()

const props = defineProps<ISubMenuProps>()
const selected = ref<string | SubMenu>(props.subMenu[0])

const router = useRouter()

const onSelect = (_menu: string | SubMenu) => {
  const menu = typeof _menu === 'string' ? _menu : _menu.label
  selected.value = menu
  menuStore.setPageName(menu)
  menuStore.turnOffSubMenu()
  router.push({
    path: `${props.parent.link}/${menu.toLowerCase().replace(' ', '-')}`
  })
}

const closeSubMenu = () => {
  menuStore.setSubMenuId('')
  router.push(props.parent.link)
}

const label = (menu: string | SubMenu) => {
  return typeof menu === 'string' ? menu : menu.label
}

const permission = (menu: string | SubMenu) => {
  return typeof menu === 'string' ? [] : menu.permission
}
</script>
<template>
  <div
    class="flex text-sm border-l border-[#315468] w-[70%] overflow-hidden h-screen-5rem px-6 py-4"
  >
    <div class="flex flex-col w-full gap-8">
      <div class="flex justify-between pb-1">
        <div class="text-[#709AB0]">{{ props.parent.label }}</div>
        <MaterialIcon
          @click="closeSubMenu"
          outline
          class="text-white cursor-pointer"
          icon="close"
          :size="24"
        />
      </div>
      <div
        @click="onSelect(menu)"
        v-for="menu of subMenu"
        :key="menu?.toString()"
        class="flex justify-between cursor-pointer hover:scale-105"
      >
        <CheckPermission :permission="permission(menu)" :pass="permission(menu).length === 0">
          <div
            :class="{
              'text-white font-bold': selected === menu,
              'text-custom_mint': selected !== menu
            }"
          >
            {{ label(menu) }}
          </div>
          <MaterialIcon
            outline
            :class="{
              'text-white': selected === menu,
              'text-custom_mint': selected !== menu
            }"
            icon="keyboard_arrow_right"
            :size="24"
          />
        </CheckPermission>
      </div>
    </div>
  </div>
</template>
