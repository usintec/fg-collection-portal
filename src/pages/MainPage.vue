<script setup lang="ts">
import { useOrganizationStore } from '@/stores/organizationStore'
import SideBar from '../components/menu/SideBar.vue'
import TopMenu from '@/components/menu/TopMenu.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import AuthService from '@/services/AuthService'

import { useNotificationStore } from '@/stores/notificationStore'
import { useUserPermission } from '@/stores/permissionStore'

const orgStore = useOrganizationStore()
const notificationStore = useNotificationStore()
const permission = useUserPermission()

const loading = ref(true)

onMounted(async () => {
  const res = await AuthService.userInfo()
  notificationStore.connectToSource([res.userId, res.organizationId])
  orgStore.setFgId(res.organizationId)
  permission.setUserPermissions(res.permission)
  loading.value = false
})

onUnmounted(() => {
  orgStore.setFgId('')
  notificationStore.disConnectFromSource()
})
</script>

<template>
  <header class="w-full h-screen flex items-center">
    <SideBar />
    <div class="relative h-full bg-bg_mint w-full flex flex-col">
      <TopMenu />

      <div class="h-full w-full overflow-scroll">
        <span v-if="loading" class="flex justify-center">
          <SpinnerComponent />
        </span>
        <RouterView v-else />
      </div>
    </div>
  </header>
</template>
