<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import MaterialIcon from '../icon/MaterialIcon.vue'
import { onMounted, ref } from 'vue'
import Notification from '@/components/notification/Notification.vue'
import NotificationDetail from '@/components/notification/NotificationDetail.vue'

const notificationStore = useNotificationStore()

const showNotification = ref(false)
const showDetails = ref(false)

const close = () => {
  showNotification.value = false
}

const closeDetails = () => {
  showDetails.value = false
}

const showNotifications = () => {
  showNotification.value = true
}

const showDetail = () => {
  showDetails.value = true
}

onMounted(() => {
  notificationStore.reloadCount()
})
</script>
<template>
  <div @click="showNotifications" class="relative hover:cursor-pointer">
    <MaterialIcon outline icon="notifications" class="text-dark_green text-2xl" />
    <div
      v-if="notificationStore.unreadCount > 0"
      class="absolute -top-1 -right-1 w-5 h-5 bg-[#CD1F68] rounded-full text-white text-xs flex justify-center items-center font-bold"
    >
      {{ notificationStore.unreadCount > 9 ? '9+' : notificationStore.unreadCount }}
    </div>
  </div>
  <div v-if="showNotification" class="absolute top-0 right-0 z-10">
    <Notification :shows="showNotification" @closeModal="close" @showDetails="showDetail" />

    <NotificationDetail :show="showDetails" @closeModal="closeDetails" />
  </div>
</template>
