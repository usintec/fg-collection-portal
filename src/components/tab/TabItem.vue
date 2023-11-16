<script setup lang="ts">
interface ITabItemProps {
  name: string
  selected: boolean
}

const props = defineProps<ITabItemProps>()
const emit = defineEmits<{
  (e: 'select'): void
}>()
</script>

<template>
  <div @click="emit('select')" class="flex flex-col justify-center items-center gap-2">
    <span
      :class="[props.selected ? 'text-[#3B7A73] font-bold' : 'text-[#7F9EB0] font-medium']"
      class="text-center text-lg font-satoshi bg-white cursor-pointer"
    >
      {{ props.name }}
    </span>
    <div class="w-full h-1" :class="[props.selected ? 'bg-[#3B7A73]' : 'bg-white']" />
  </div>
</template>
