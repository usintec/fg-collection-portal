<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import type { SelectOptions } from './types'

const props = defineProps<{
  item: Partial<SelectOptions>
  lastItem: boolean
  errorMessages?: {
    value?: string
    text?: string
  }
}>()

const emit = defineEmits<{
  (e: 'change', v: Partial<SelectOptions>): void
  (e: 'remove'): void
  (e: 'add'): void
}>()

const setState = (key: keyof SelectOptions, v: any) => {
  const value = { ...props.item, [key]: v }
  emit('change', value)
}
</script>

<template>
  <div
    class="bg-[#F1FAFF] text-sm text-[#6E91A5] h-16 flex gap-4 rounded-md justify-between items-center px-5"
  >
    <MaterialIcon icon="drag_indicator" class="text-[#A1AAC9] cursor-grab option-dragging-icon" />
    <div class="flex gap-4 flex-1 flex-3 h-11 text-black">
      <TextInput
        placeholder="Option Text"
        whiteBg
        label=""
        :value="item.text"
        :onChange="(v) => setState('text', v)"
        class="w-1/2"
        :errorMessage="errorMessages?.text"
      />
      <TextInput
        placeholder="Option Value"
        whiteBg
        :value="item.value"
        label=""
        :onChange="(v) => setState('value', v)"
        class="w-1/2"
        :errorMessage="errorMessages?.value"
      />
    </div>
    <div class="flex gap-2 min-w-[50px] justify-between">
      <div
        v-if="lastItem"
        @click="() => emit('add')"
        class="flex rounded-full w-5 aspect-square justify-center items-center bg-[#5A7E9F] text-white text-sm cursor-pointer hover:scale-105"
      >
        <MaterialIcon icon="add" class="text-sm" />
      </div>
      <div
        @click="() => emit('remove')"
        class="flex rounded-full w-5 mx-auto aspect-square justify-center items-center bg-[#ff3566] text-white text-sm cursor-pointer hover:scale-105"
      >
        <MaterialIcon icon="close" class="text-sm" />
      </div>
    </div>
  </div>
</template>
