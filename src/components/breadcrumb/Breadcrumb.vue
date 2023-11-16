<script setup lang="ts">
interface IBreadcrumb {
  title: string
  name: string
}

const props = defineProps<IBreadcrumb>()
</script>
<template>
  <div class="h-[68px] flex items-center">
    <div class="gap-6 font-satoshi">
      <span class="text-[rgb(26,56,72)] text-base font-bold">{{ props.title }}</span>
      <p class="text-[#8492B6] font-thin text-sm mt-0.5">{{ props.name }}</p>
    </div>
  </div>
</template>

<style>
.bg-color {
  width: 152px;
  background: #77a4b2 !important;
}
.bg {
  width: 152px;
}
</style>
