<script setup lang="ts">
import { currencyEnum, type ICard } from './types'
import MaterialIcon from '../icon/MaterialIcon.vue'

defineProps<{
  card: ICard
}>()
</script>
<template>
  <div class="bg-[#DAF2E2] rounded-xl shadow w-80 h-48">
    <div class="flex justify-between p-4">
      <div class="relative inline-flex items-center">
        <MaterialIcon class="mr-1" outline :icon="card.icon" />
        <p class="text-[#204458] text-left text-sm font-satoshi pl-1">{{ card.title }}</p>
      </div>
      <label
        class="relative inline-flex items-center cursor-pointer"
        v-if="card.currency != currencyEnum.NONE"
      >
        <span class="text-[#204458] text-left font-bold text-sm font-satoshi ml-3">{{
          card.currency
        }}</span>
      </label>
    </div>
    <p class="text-[#204458] text-left text-5xl font-bold font-satoshi pl-4 mt-3 -tracking-extra">
      <span v-if="card.currency == 'NGN'">&#8358;</span>
      <span v-if="card.currency == 'USD'">&#36;</span>{{ card.amount }}
    </p>
  </div>
</template>
