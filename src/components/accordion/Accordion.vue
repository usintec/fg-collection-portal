<script setup lang="ts">
import { ref } from 'vue'
import MaterialIcon from '../icon/MaterialIcon.vue'

interface IAccord {
  items: any
}

const props = defineProps<IAccord>()

const activeIndex = ref(-1)

const toggle = (index: number) => {
  activeIndex.value = activeIndex.value === index ? -1 : index
}
</script>

<template>
  <div class="bg-white">
    <div v-for="(item, index) in props.items" :key="index" class="mb-2">
      <div
        @click="() => toggle(index)"
        class="cursor-pointer p-2 border border-gray-300 shadow rounded"
      >
        <div class="flex items-center justify-between rounded">
          <div class="flex items-center">
            <slot name="header" :index="index"></slot>
          </div>
          <div class="flex items-center">
            <slot name="icon" :item="item" :index="index">
              <MaterialIcon class="mr-1" outline :icon="activeIndex !== index ? 'add' : 'remove'" />
            </slot>
          </div>
        </div>
      </div>
      <div v-if="activeIndex === index" class="p-2 border border-gray-300 rounded">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
