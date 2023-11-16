<script setup lang="ts">
interface show {
  title?: string
  bg?: string
  text?: string
  width?: string
}

const props = defineProps<show>()
defineEmits<{
  (e: 'closeModal'): void
}>()
</script>

<template>
  <div class="border rounded-t-lg">
    <div
      class="header rounded-t-lg p-3"
      :class="{
      'bg-[#CBFFE0]': !props.bg,
      [props.bg!]: !!props.bg,
        }"
    >
      <p
        class="text-sm font-normal"
        :class="{
      'text-[#078037]': !props.text,
      [props.text!]: !!props.text,
        }"
      >
        {{ props.title }}
      </p>
    </div>

    <div class="body">
      <slot name="content" />
    </div>
  </div>
</template>
