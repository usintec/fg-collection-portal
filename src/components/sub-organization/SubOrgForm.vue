<script setup lang="ts">
import Stepper from '@/components/stepper/Stepper.vue'
import { ref } from 'vue'
import CreateSubOrganization from './CreateSubOrganization.vue'

const steps = ['Basic Details', 'Create contact person']
const step = ref(0)

const next = () => {
  step.value++
}

const back = () => {
  step.value--
}

const createNew = () => (step.value = 0)
</script>
<template>
  <div class="bg-white p-11 rounded-3xl">
    <div class="flex">
      <div class="w-2/5">
        <Stepper :steps="steps" :currentStep="step" />
      </div>
      <div class="w-3/5">
        <CreateSubOrganization :step="step" @next="next" @back="back" @new="createNew" />
      </div>
    </div>
  </div>
</template>
