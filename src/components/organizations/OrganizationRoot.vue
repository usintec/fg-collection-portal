<script setup lang="ts">
import { usePageNameStore } from '@/stores/pageName'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const routes = useRoute()
const pageStore = usePageNameStore()

const setSubMenu = (path: string) => {
  const subMenu = path.split('/')
  if (subMenu.length > 2 && subMenu[1] === 'organizations') {
    pageStore.setSubMenuId('Organization')
  }
}

onMounted(() => {
  setSubMenu(routes.fullPath)
})

watch(
  () => routes.fullPath,
  () => {
    setSubMenu(routes.fullPath)
  }
)
</script>
<template>
  <div class="h-full w-full overflow-scroll">
    <router-view></router-view>
  </div>
</template>
