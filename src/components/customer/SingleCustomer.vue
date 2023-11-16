<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import type { ICustomerRead } from '@/services/types'

defineProps<ICustomerRead>()

defineEmits<{
  (e: 'onRemove'): void
}>()
</script>
<template>
  <div class="bg-[#F3FEFD] rounded-lg px-5 py-3 flex justify-between">
    <div class="flex flex-col gap-1">
      <span class="text-dark_green font-medium text-base">{{ name }}</span>
      <div class="flex gap-4 text-[#4A7B77] text-sm">
        <span>{{ email }}</span>
        <span>|</span>
        <span>{{ phoneNumber }}</span>
      </div>
    </div>
    <div @click="$emit('onRemove')">
      <div class="rounded-md flex justify-center items-center bg-[#D4F4E1] w-8 h-8">
        <MaterialIcon outline icon="delete" class="text-sm text-dark_green cursor-pointer" />
      </div>
    </div>
  </div>
</template>
