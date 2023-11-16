<script setup lang="ts">
import { ref } from 'vue'

interface Option {
  label: string
  value: string
  name: string
  disabled: boolean
  activeGreen?: boolean
}
const props = defineProps<Option>()

const selectedValue = ref(props.value === 'individual' ? 'individual' : '')
</script>

<template>
  <div class="flex items-center justify-center gap-3 flex-row-reverse">
    <label class="text-[13px] font-bold font-satoshi text-[#204458]">
      {{ props.label }}
    </label>
    <input
      class="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-dark:bg-green-500 hover:before:opacity-10"
      :class="{
        'checked:bg-dark_green checked:before:bg-dark_green border-dark_green ': !activeGreen,
        'checked:bg-green-500 checked:before:bg-green-500 border-green-500 ': activeGreen
      }"
      type="radio"
      :value="props.value"
      v-model="selectedValue"
      :name="props.name"
      :disabled="props.disabled"
      @change="() => $emit('onChecked', selectedValue)"
    />
  </div>
</template>
