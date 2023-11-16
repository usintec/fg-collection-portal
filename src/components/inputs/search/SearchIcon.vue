<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'

interface ISearchInputProps {
  label: string
  onChange: (v: string) => void
  placeholder?: string
  important?: string
  errorMessage?: string
  loading?: boolean
}

const props = defineProps<ISearchInputProps>()
// const onChange = (e: Event) => {
//   const target = e.target as HTMLInputElement
//   props.onChange(target.value)
// }
</script>
<template>
  <span class="w-full h-full flex items-center">
    <template v-if="!!props.loading">
      <SpinnerComponent class="bg-input_mint h-full p-4" />
    </template>
    <template v-else>
      <div
        class="p-4 h-full cursor-pointer hover:scale-105 rounded-e-lg bg-input_mint text-black text-center txt-small font-semibold font-satoshi"
      >
        <slot></slot>
        <MaterialIcon outline icon="search" class="bg-input_mint text-blue" />
      </div>
    </template>
  </span>
</template>

<style scoped>
::placeholder {
  color: #a6bac5;
  font-family: 'Satoshi';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
</style>
