<script setup lang="ts">
import useDetectOutsideClick from '@/hooks/useClickOutSide'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'clickOutSide'): void
}>()

const el = ref()

useDetectOutsideClick(el, () => {
  emit('clickOutSide')
})
</script>
<template>
  <div ref="el">
    <slot></slot>
  </div>
</template>
