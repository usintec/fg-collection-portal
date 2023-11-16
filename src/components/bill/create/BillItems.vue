<script setup lang="ts">
import type { PayableItemModel } from '@/services/types'
import BillItemRow from './BillItemRow.vue'
interface IProps {
  items: PayableItemModel[]
}
defineProps<IProps>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()
</script>
<template>
  <div
    class="grid-cols-11 grid text-dark_green font-bold text-sm border-b border-[#EAEFFC] pb-4 mb-2"
  >
    <span class="col-span-3 2xl:col-span-4">Item Details</span>
    <span class="col-span-2">Price</span>
    <span class="col-span-2">TAX</span>
    <span class="col-span-2 2xl:col-span-1">Quantity</span>
    <span class="col-span-2 text-right md:text-center lg:text-left">Total</span>
  </div>
  <BillItemRow
    v-for="item in items"
    :key="item.payableItemId"
    v-bind="item"
    @remove="() => emit('remove', item.payableItemId)"
  />
</template>
