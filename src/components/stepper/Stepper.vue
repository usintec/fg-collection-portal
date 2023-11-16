<script setup lang="ts">
import MaterialIconVue from './../icon/MaterialIcon.vue'

const props = defineProps<{
  steps: string[]
  currentStep: number
}>()
</script>

<template>
  <ol class="relative text-gray-500 font-satoshi">
    <li v-for="(step, i) in props.steps" :key="i" class="flex flex-col">
      <div class="flex gap-4">
        <span
          class="flex items-center justify-center w-7 h-7 rounded-full font-medium text-base text-center"
          :class="[
            i > props.currentStep
              ? 'bg-[#EBF1FF] text-[#A2ABC0]'
              : i === currentStep
              ? 'bg-[#DEF3FF] text-dark_green'
              : 'bg-green_regular text-white'
          ]"
        >
          <MaterialIconVue v-if="i < props.currentStep" icon="check" class="text-white text-base" />
          <span v-else> {{ i + 1 }}</span>
        </span>
        <h3
          class="font-medium leading-tight text-base pt-1"
          :class="{
            'text-dark_green': i === props.currentStep,
            'text-[#A2ABC0]': i > props.currentStep,
            'text-green_regular': i < props.currentStep
          }"
        >
          {{ step }}
        </h3>
      </div>
      <div v-if="i < steps.length - 1" class="w-[2px] h-9 bg-[#D3DCF1] ml-3" />
    </li>
  </ol>
</template>
