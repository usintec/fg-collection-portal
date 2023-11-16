<script setup lang="ts">
const props = defineProps<{ name: string }>()
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
</script>

<template>
  <div class="w-full h-full flex justify-center items-center text-center">
    <div>
      <MaterialIcon icon="sentiment_dissatisfied" class="text-9xl text-green_regular" />
      <h1 class="text-4xl text-gray-400">
        <span class="text-gray-700">{{ props.name }}</span> page is not implemented!
      </h1>
    </div>
  </div>
</template>
