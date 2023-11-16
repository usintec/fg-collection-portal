<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import { ref } from 'vue'

interface IInputProps {
  label: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  important?: string
  errorMessage?: string
  value?: string
  whiteBackground?: boolean
  border?: boolean
  description?: string
  disabled?: boolean
  min?: string
  copy?: boolean
  absolute?: boolean
  copyCallback?: () => void
}

const props = defineProps<IInputProps>()
const showPassword = ref(false)

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  props.onChange(target.value)
}
const toggleShowPassword = () => (showPassword.value = !showPassword.value)

const handleCopyClick = () => {
  if (props.copyCallback) {
    props.copyCallback()
  }
}
</script>
<template>
  <div class="flex flex-col gap-1">
    <label class="font-satoshi text-dark_green text-sm font-medium"
      >{{ label }} <span class="text-red-600">{{ important }}</span></label
    >
    <div class="w-full h-14">
      <div class="w-full h-full flex items-center" :class="{ 'flex-row-reverse': !absolute }">
        <input
          :disabled="disabled"
          class="w-full h-full rounded-lg px-4 pr-7 focus:outline-green_regular"
          :class="{
            'border border-red-600 focus:outline-red-500': errorMessage,
            'focus:outline-green_regular': !errorMessage,
            'bg-white': whiteBackground,
            'bg-input_mint': !whiteBackground,
            border: border
          }"
          :placeholder="props.placeholder"
          @change="onChange"
          @input="onChange"
          :value="value"
          :type="showPassword ? 'text' : type"
          :min="type === 'date' ? min : undefined"
        />
        <MaterialIcon
          :absolute="absolute"
          class="m-6 cursor-pointer hover:scale-105 text-green_regular"
          :class="{ absolute: !absolute }"
          v-if="props.type === 'password'"
          :onClick="toggleShowPassword"
          :icon="!showPassword ? 'visibility' : 'visibility_off'"
          outline
        />
        <MaterialIcon
          class="absolute m-1 cursor-pointer hover:scale-105 text-[#119AE7] text-lg"
          v-if="props.copy"
          :onClick="handleCopyClick"
          icon="content_copy"
          outline
        />
      </div>
      <span v-if="description" class="font-satoshi text-[#747EA1] text-sm font-thin">{{
        description
      }}</span>
    </div>
  </div>
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
