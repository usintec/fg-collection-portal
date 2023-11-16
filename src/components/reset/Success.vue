<script setup lang="ts">
import MaterialIcon from '../icon/MaterialIcon.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'

interface Emit {
  (e: 'goBack'): void
}

defineEmits<Emit>()
</script>
<template>
  <div
    class="bg-white w-[90%] lg:w-1/2 md:w-2/3 xl:w-1/3 rounded-[30px] flex justify-center items-center flex-col p-9"
  >
    <div class="w-full h-full rounded-2xl bg-[#F1FAFF] flex justify-center items-center p-9">
      <div class="flex flex-col gap-5 items-center">
        <div
          class="w-24 h-24 bg-[#5D9799] text-white justify-center items-center rounded-full flex"
        >
          <MaterialIcon icon="check" class="text-2xl" />
        </div>
        <span class="font-medium text-dark_green text-2xl">
          <slot name="big-text"></slot>
        </span>
        <span class="text-[#2B5276] text-center text-sm font-medium">
          <slot name="long-text"></slot>
        </span>
        <ButtonInput @click="$emit('goBack')">
          <span class="text-white text-sm font-medium"> <slot name="button-text"></slot> </span>
        </ButtonInput>
      </div>
    </div>
  </div>
</template>
