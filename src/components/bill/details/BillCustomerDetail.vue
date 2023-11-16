<script setup lang="ts">
import type { ICustomer } from '@/services/types'

defineProps<ICustomer>()
</script>
<template>
  <div class="h-44 w-2/3 xl:w-1/2 2xl:w-1/3 px-5 py-7 flex flex-col bg-[#F6F8FF] rounded-lg">
    <div class="flex justify-between items-start pb-5 border-b border-[#D9DFF8]">
      <div class="flex flex-col w-2/3">
        <span class="text-[#204458] text-base font-medium">{{ name }}</span>
        <span class="text-dark_green text-sm font-normal">{{ email }} | {{ phoneNumber }}</span>
      </div>
      <div class="w-[77px] h-8 flex items-center justify-center rounded-md bg-[#A4B2E4] text-white">
        Details
      </div>
    </div>
    <div class="text-dark_green text-sm font-normal mt-5">
      <div>
        <span class="mr-8">NIN: {{ nin }}</span> <span>BVN: {{ bvn }}</span>
      </div>
      {{ address }}
    </div>
  </div>
</template>
