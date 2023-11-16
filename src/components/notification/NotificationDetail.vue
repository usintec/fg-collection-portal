<script setup lang="ts">
import Modal from '../modal/Modal.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { useNotificationStore } from '@/stores/notificationStore'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const notificationStore = useNotificationStore()

const getDate = (d: Date) => {
  const month = d.toLocaleString('default', { month: 'short' })
  return `${d.getDate()} ${month}, ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
}
</script>

<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      :title="notificationStore.selectedNotification?.subject ?? ''"
      width="w-11/12 lg:w-1/2 xl:w-5/12 2xl:w-1/4"
    >
      <template v-slot:content>
        <div class="">
          <div class="mt-12 mb-10">
            <p
              v-if="!notificationStore.selectedNotification?.isHtml"
              class="text-[#5E6D8A] font-normal text-sm pb-5"
            >
              {{ notificationStore.selectedNotification?.content }}
            </p>
            <span v-else v-html="notificationStore.selectedNotification.content"></span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-[#5D9799] text-sm font-normal">{{
              getDate(notificationStore.selectedNotification?.createdOn ?? new Date())
            }}</span>

            <div class="w-1/4">
              <ButtonInput
                class="mt-9 text-sm"
                bg="bg-[#204458]"
                :onClick="() => emit('closeModal')"
              >
                Mark as Read
              </ButtonInput>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
