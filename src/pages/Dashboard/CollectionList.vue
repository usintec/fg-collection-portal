<script setup lang="tsx">
// import dateFormat from 'dateformat'
import type { IListColumn } from '@/components/list/types'
import ListHolder from '@/components/list/ListHolder.vue'
import type { ICollection } from '@/services/types'

const props = defineProps<{ data: ICollection[] | undefined }>()
const column: IListColumn<ICollection>[] = [
  {
    id: 'customerName',
    name: 'Customer',
    isSortable: true,
    width: 200,
    dataFiled: 'customerName'
  },
  {
    id: 'invoiceNumber',
    name: 'Invoice',
    isSortable: true,
    width: 200,
    dataFiled: 'invoiceNumber'
  },
  {
    id: 'amount',
    name: 'Amount',
    isSortable: true,
    width: 200,
    dataFiled: 'amount'
  },
  {
    id: 'currency',
    name: 'Currency',
    isSortable: true,
    width: 200,
    dataFiled: 'currency'
  },
  {
    id: 'transactionReference',
    name: 'Transaction',
    isSortable: true,
    width: 200,
    dataFiled: 'transactionReference'
  },
  {
    id: 'action',
    name: 'Action',
    isSortable: true,
    width: 200,
    dataFiled: 'transactionReference',
    cell: true
  }
]
</script>

<template>
  <ListHolder
    :onCreate="console.log"
    title="Collections"
    :data="props.data ?? []"
    :columns="column"
    :pagination="true"
  >
    <template #action="{ transactionReference }">
      <div
        @click="console.log(transactionReference)"
        class="w-16 h-7 border rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
      >
        View
      </div>
    </template>
  </ListHolder>
</template>
