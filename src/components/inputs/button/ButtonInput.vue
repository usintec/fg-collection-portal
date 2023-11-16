<script setup lang="ts">
interface IButtonProps {
  onClick: () => void
  icon?: string
  loading?: boolean
  bg?: string
  iconLeft?: boolean
}
const props = defineProps<IButtonProps>()
import MaterialIcon from '../../icon/MaterialIcon.vue'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
</script>

<template>
  <button
    v-bind="props"
    :class="{
      'bg-gradient-to-r from-[#4B7A94] to-[#57829A]': !props.bg,
      [props.bg!]: !!props.bg
    }"
    class="py-4 px-2 rounded-lg flex gap-2 w-full justify-center items-center text-white"
  >
    <template v-if="!!props.loading"> <SpinnerComponent /> </template>
    <template v-else>
      <MaterialIcon outline v-if="props.icon && props.iconLeft" :icon="props.icon" class="" />
      <div class="text-center font-bold font-satoshi"><slot></slot></div>
      <MaterialIcon outline v-if="props.icon && !props.iconLeft" :icon="props.icon" class="" />
    </template>
  </button>
</template>
