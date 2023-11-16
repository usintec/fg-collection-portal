<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { SelectOptions } from './types'
import DynamicSelectOptionItem from './DynamicSelectOptionItem.vue'

defineProps<{
  errorMessages?: {
    value?: string
    text?: string
  }[]
}>()

const emit = defineEmits<{
  (e: 'change', v: Partial<SelectOptions>[]): void
}>()

onMounted(() => {
  emit('change', options.value)
})

const radomStr = () => `${Math.random()}`.slice(2)

const options = ref<Partial<SelectOptions>[]>([{ id: radomStr() }])

watch(options, () => {
  emit('change', options.value)
})

const setForm = (v: Partial<SelectOptions>, i: number) => {
  options.value[i] = v
}

const addNewFiled = () => {
  options.value.push({ id: radomStr() })
}

const removeAt = (index: number) => {
  options.value = options.value.filter((_, i) => i !== index)
}
</script>
<template>
  <VueDraggable
    ref="div"
    class="w-2/3 flex flex-col justify-end items-end gap-4 mt-8"
    v-model="options"
    :animation="150"
    bubbleScroll
    ghostClass="opacity-10"
    handle=".option-dragging-icon"
  >
    <DynamicSelectOptionItem
      class="w-full"
      v-for="(item, i) in options"
      :key="item.id"
      :item="item"
      :lastItem="i === options.length - 1"
      :errorMessages="errorMessages?.[i]"
      @remove="() => removeAt(i)"
      @change="(v) => setForm(v, i)"
      @add="addNewFiled"
    />
  </VueDraggable>
</template>
