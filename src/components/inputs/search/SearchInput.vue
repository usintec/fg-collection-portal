<script setup lang="ts">
interface ISearchInputProps {
  label: string
  onChange: (v: string) => void
  placeholder?: string
  important?: string
  errorMessage?: string
  loading?: boolean
}

const props = defineProps<ISearchInputProps>()
const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  props.onChange(target.value)
}
</script>
<template>
  <div class="flex flex-col gap-1">
    <label class="font-satoshi text-dark_green text-sm font-medium"
      >{{ props.label }} <span class="text-red-600">{{ props.important }}</span></label
    >
    <div class="w-full h-14">
      <div class="w-full h-full flex items-center">
        <input
          class="w-full h-full bg-input_mint rounded-s-lg px-4 focus:outline-green_regular"
          :class="{
            'border border-red-600 focus:outline-red-500': errorMessage,
            'focus:outline-green_regular': !errorMessage
          }"
          :placeholder="props.placeholder"
          @change="onChange"
        />
      </div>
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
