<script setup lang="ts">
import { ref } from 'vue'
import SuperAdminOnBoarding from '@/components/onboarding/SuperAdminOnBoarding.vue'
import Stepper from '@/components/stepper/Stepper.vue'

const loading = ref(false)
const step = ref(0)

const steps = ['Basic Details', 'Create contact person', 'Create Superadmin']

const back = () => {
  step.value--
}

const next = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    step.value++
  }, 1000)
}
</script>
<template>
  <div class="bg-dark_green">
    <div class="login-bg flex flex-col items-center justify-center">
      <span class="text-white text-center font-satoshi text-2xl font-black"
        >REV<span class="font-normal">ASSURE</span></span
      >
      <span class="text-mini font-satoshi text-center text-base font-normal mb-3"
        >Onboarding Superadmin</span
      >

      <div
        class="flex flex-col xl:flex-row bg-white mx-auto max-h-full rounded-2xl shadow-lg px-8 py-5 w-1/2 gap-5"
      >
        <Stepper :steps="steps" :currentStep="step" />
        <SuperAdminOnBoarding :step="step" @next="next" @back="back" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-bg {
  background-image: url('../assets/login_bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
}

.text-mini {
  color: #91c1dc;
}
</style>
