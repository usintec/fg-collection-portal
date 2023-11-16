<script setup lang="ts">
import MaterialIcon from '../icon/MaterialIcon.vue'

defineProps<{
  text: string
  successText: string
}>()
</script>
<template>
  <div class="px-0 w-[500px] bg-[#F1FAFF]">
    <div class="done-bg text-center py-10 px-10 flex flex-col justify-center items-center">
      <div
        class="flex justify-center bg-green_regular w-28 aspect-square rounded-full items-center"
      >
        <MaterialIcon outline icon="done" class="text-white rounded-full bg-green p-4 text-6xl" />
      </div>

      <div class="mt-5 px-8">
        <h3 class="text-2xl font-medium font-satoshi text-dark_green mb-4">{{ successText }}</h3>
        <p class="font-satoshi font-normal text-sm text-[#2B5276]">
          {{ text }}
        </p>
      </div>

      <slot></slot>
    </div>
  </div>
</template>
