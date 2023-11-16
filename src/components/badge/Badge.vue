<script setup lang="ts">
interface IBadgeProps {
  class: 'success' | 'primary' | 'warning' | 'danger'
}
const props = defineProps<IBadgeProps>()
</script>

<template>
  <div
    class="w-20 h-5 font-satoshi text-xs rounded-3xl flex justify-center items-center text-white capitalize"
    :class="`${props.class}`"
  >
    <slot name="content" />
  </div>
</template>

<style>
.success {
  background-color: #56d07f;
  color: white;
}

.primary {
  background-color: #8456d0;
  color: white;
}

.warning {
  background-color: #fff0c9;
  color: #985e06;
}

.danger {
  background-color: #ec3174;
  color: white;
}
</style>
