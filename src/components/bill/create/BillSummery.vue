<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import { usePayableItems } from '@/stores/payableItemStore'
const store = usePayableItems()

const formatMoney = (value: number | string) => {
  const num = Number(value)
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const _currencyCode = (code: string): number => {
  switch (code) {
    case 'NGN':
      return 8358
    case 'USD':
      return 36
    case 'EUR':
      return 8364
    case 'GBP':
      return 163
    default:
      return 1
  }
}
</script>
<template>
  <div
    v-if="Object.keys(store.summery).length > 0"
    class="rounded-lg border border-[#D5DDF0] w-full flex py-6 px-7 mt-5"
  >
    <div class="w-1/2 flex flex-col gap-2">
      <span class="text-dark_green font-medium text-sm">Bill item types</span>
      <span class="w-1/2 break-words text-[#204458] text-xs font-normal">
        Please note that this bill contains payable items with mixed currencies. This means separate
        invoices will be generated and items grouped based on currency.
      </span>
    </div>
    <div class="w-1/2 flex flex-col gap-2">
      <span class="text-dark_green font-medium text-sm mb-5">Sub Total</span>
      <div class="flex w-full flex-col gap-1 border-b pb-2 border-b-[#EAEFFC]">
        <div class="flex justify-between" v-for="obj of Object.keys(store.summery)" :key="obj">
          <span class="text-dark_green text-sm font-normal">Items ({{ obj }})</span>
          <span class="text-[#2F3A61] text-sm font-bold"
            >{{ String.fromCharCode(_currencyCode(obj)) }}
            {{ formatMoney(store.summery[obj]) }}</span
          >
        </div>
      </div>
      <div class="flex justify-between">
        <span class="text-[#2F3A61] text-sm font-bold">Total</span>
        <div class="w-1/2 flex flex-row-reverse">
          <div
            class="flex gap-1 items-center"
            v-for="(obj, i) of Object.keys(store.summery)"
            :key="obj"
          >
            <span v-if="i + 1 < Object.keys(store.summery).length">
              <MaterialIcon class="text-sm px-2" icon="add"
            /></span>
            <span class="text-[#2F3A61] text-sm font-bold"
              >{{ String.fromCharCode(_currencyCode(obj)) }}
              {{ formatMoney(store.summery[obj]) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
