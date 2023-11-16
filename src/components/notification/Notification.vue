<script setup lang="ts">
import MaterialIcon from '../icon/MaterialIcon.vue'
import Badge from '../badge/Badge.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { onMounted, ref } from 'vue'
import type { NotificationItem } from '@/services/types'
import { useUserStore } from '@/stores/userStore'

interface show {
  shows: boolean
}

const props = defineProps<show>()
defineEmits<{
  (e: 'closeModal'): void
  (e: 'showDetails'): void
}>()

const notifications = ref<NotificationItem[]>([])

const notificationStore = useNotificationStore()
const userStore = useUserStore()

onMounted(() => {
  notifications.value = notificationStore.getNotifications()
})

const getDate = (d: Date) => {
  const month = d.toLocaleString('default', { month: 'short' })
  return `${d.getDate()} ${month}, ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
}

const markAllRead = () => {
  notificationStore.markAllRead(userStore.getUserId() ?? '')
}
</script>

<template>
  <div v-if="props.shows" class="flex justify-end max-w-[400px]">
    <div class="" @click="$emit('closeModal')"></div>
    <div class="bg-white h-screen shadow-lg z-50 overflow-y-auto px-8 py-8">
      <div class="flex gap-8 justify-between mb-8">
        <div>
          <h3 class="text-sm text-[#204458] font-bold">Notifications</h3>
        </div>
        <div class="flex gap-3">
          <span
            @click="markAllRead"
            class="text-[#3D83EC] cursor-pointer hover:underline hover:scale-105 text-sm"
            >Mark All as Read</span
          >
          <span
            class="flex rounded-full w-5 h-5 justify-center items-center bg-bg_mint text-dark_green text-sm cursor-pointer hover:scale-105"
            @click="$emit('closeModal')"
          >
            <MaterialIcon icon="close" class="text-sm" />
          </span>
        </div>
      </div>

      <div class="flex flex-col">
        <div
          v-for="notification of notifications"
          :key="notification.id"
          class="border-b pb-5 mb-5 hover:cursor-pointer"
          @click="
            () => {
              notificationStore.setSelectedNotification(notification)
              $emit('showDetails')
            }
          "
        >
          <div class="text-black font-black text-sm opacity-80 my-2">
            {{ notification.subject }}
          </div>
          <p
            v-if="!notification.isHtml"
            class="text-[#5E6D8A] font-normal text-sm overflow-hidden text-ellipsis max-h-[20px]"
          >
            {{ notification.content }}
          </p>
          <span v-else v-html="notification.content"></span>
          <div class="flex justify-between mt-3">
            <span class="text-[#5D9799] text-sm font-normal">{{
              getDate(notification.createdOn)
            }}</span>
            <Badge v-if="!notification.read" class="success">
              <template v-slot:content>
                <div
                  @click.prevent="() => notificationStore.markRead(notification.id)"
                  class="flex new w-full px-2 justify-center items-center hover:justify-between"
                >
                  New
                  <MaterialIcon icon="check" class="text-sm hidden check" />
                </div>
              </template>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new:hover .check {
  display: flex;
}
</style>
