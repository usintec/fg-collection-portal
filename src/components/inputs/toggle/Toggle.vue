<script setup lang="ts">
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
interface IInputProps {
  isActive: boolean
  isLoading?: boolean
  onChange: (v: boolean) => void
}

const props = defineProps<IInputProps>()

const onChange = () => {
  props.onChange(!props.isActive)
}
</script>
<template>
  <div @click="onChange" class="relative inline-block w-10 mr-2 align-middle select-none">
    <input
      v-if="!isLoading"
      type="checkbox"
      class="toggle-checkbox absolute block w-3 h-3 rounded-full bg-[#A0BEAB] top-1 left-1 appearance-none cursor-pointer transition-transform duration-300 ease-in-out"
      :checked="isActive"
    />
    <SpinnerComponent v-else />
    <label
      class="toggle-label block overflow-hidden w-[43px] h-[20px] rounded-full bg-[#D8ECDF] cursor-pointer transition-all duration-300 ease-in-out"
    ></label>
  </div>
</template>

<style>
.toggle-checkbox:checked {
  background-color: #68d391;
  transform: translateX(170%);
}

.toggle-label {
  left: 0;
}
</style>
