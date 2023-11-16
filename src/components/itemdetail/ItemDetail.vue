<script setup lang="ts">
import type { LineItem } from '@/services/types'

defineProps<{
  itemList: LineItem[]
  currency: string
}>()
const formatMoney = (value: number | string | undefined) => {
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
  <div class="flex w-full">
    <table class="w-full bg-white font-satoshi">
      <thead class="bg-[#204458] text-white text-sm font-medium font-satoshi w-full">
        <tr>
          <th class="w-1/4 py-4">Item Details</th>
          <th>Quantity</th>
          <th>Tax</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody class="bg-white text-sm">
        <tr
          v-for="row in itemList"
          :key="row.gifmisCode"
          class="text-sm font-satoshi font-medium border-t border-b"
        >
          <td class="pl-2 text-[#204458] text-base font-satoshi">
            <span class="font-bold">{{ row.name }}</span>
            <br />
            <span v-if="row.gifmisCode" class="text-sm pt-2">GIFMIS: {{ row.gifmisCode }}</span>
            <span v-if="!row.gifmisCode" class="text-sm pt-2">{{ row.description }}</span>
          </td>
          <td class="text-center py-5 text-[#2F3A61] text-sm font-satoshi">
            {{ row.quantity }}
          </td>
          <td class="text-center text-[#303031] text-sm font-satoshi">
            {{ String.fromCharCode(_currencyCode(currency)) }}
            {{ formatMoney(row.tax.value) }}
          </td>
          <td class="text-center text-[#2F3A61] text-sm font-satoshi">
            {{ String.fromCharCode(_currencyCode(currency)) }}
            {{ formatMoney(row.price) }}
          </td>
          <td class="text-center text-[#2F3A61] text-sm font-satoshi">
            {{ String.fromCharCode(_currencyCode(currency)) }}
            {{ formatMoney(row.price * row.quantity) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
