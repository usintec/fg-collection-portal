<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import type { IOption } from '@/services/types'

interface ISearchProps {
  options: IOption[]
  addMore?: boolean
  loading?: boolean
}

defineProps<ISearchProps>()

const emit = defineEmits<{
  (e: 'onRowClick', value: IOption): void
  (e: 'addNew'): void
  (e: 'close'): void
}>()
</script>
<template>
  <div
    :style="{
      maxHeight: options.length === 0 ? undefined : `${options.length * 100}px`
    }"
    class="bg-white border-[#E9EEFF] border rounded-lg w-full shadow z-50 pt-3 flex flex-col overflow-scroll"
  >
    <div class="flex px-4 justify-between mb-4">
      <span class="text-[#6A789A] text-base font-normal"
        >Found {{ options.length }} results based on your search</span
      >
      <div
        @click="() => emit('close')"
        class="flex rounded-full w-7 h-7 justify-center items-center bg-bg_mint text-dark_green text-sm cursor-pointer hover:scale-105"
      >
        <MaterialIcon icon="close" class="text-sm" />
      </div>
    </div>
    <div v-if="loading" class="flex justify-center bg-white items-center h-40">
      <SpinnerComponent />
    </div>
    <div v-else-if="options.length > 0" class="flex px-4 my-2 flex-col">
      <div
        @click="() => emit('onRowClick', item)"
        class="px-2 border-b-[#EAEFFC] py-2 text-[#5E6D8A] text-base border-b-2 hover:bg-bg_mint capitalize cursor-pointer"
        v-for="item of options"
        :key="item.value"
      >
        {{ item.label }}
      </div>
    </div>
    <div v-else>
      <div class="flex justify-center bg-white items-center h-40">
        <span class="text-[#6A789A] text-base font-normal">No results found</span>
      </div>
    </div>
    <div
      @click="() => emit('addNew')"
      v-if="addMore"
      class="mt-auto bg-[#E0F5E7] rounded-md h-10 flex justify-center cursor-pointer items-center"
    >
      <div class="flex gap-1 p-3 items-center justify-center hover:scale-105">
        <MaterialIcon class="cursor-pointer hover:scale-105 text-[#7C93C7]" icon="add" outline />
        <span class="text-[#405585] font-normal text-base">Add New</span>
      </div>
    </div>
  </div>
</template>
