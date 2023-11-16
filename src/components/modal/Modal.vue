<script setup lang="ts">
import MaterialIcon from '../icon/MaterialIcon.vue'

interface show {
  shows: boolean
  title?: string
  class?: string
  width?: string
}

const props = defineProps<show>()
defineEmits<{
  (e: 'closeModal'): void
}>()
</script>

<template>
  <!-- Main modal -->
  <div v-if="props.shows" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="absolute inset-0 bg-black opacity-50" @click="$emit('closeModal')"></div>
    <div
      class="modal-container bg-white mx-auto max-h-full rounded-2xl shadow-lg z-50 overflow-y-auto"
      :class="[props.width ? width : 'w-1/2']"
    >
      <!-- Modal content -->
      <div class="rounded-lg shadow dark:bg-gray-700 modal-content py-8 text-left px-6">
        <!-- Modal header -->
        <div class="flex justify-between items-center pb-2">
          <p class="text-2xl font-bold text-dark_green">{{ props.title }}</p>
          <div
            @click="$emit('closeModal')"
            class="flex rounded-full w-7 h-7 justify-center items-center bg-bg_mint text-dark_green text-sm cursor-pointer hover:scale-105"
          >
            <MaterialIcon icon="close" class="text-sm" />
          </div>
        </div>
        <!-- Modal body -->
        <div class="modal-body gap-8">
          <div :class="`${props.class}`">
            <slot name="content" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
