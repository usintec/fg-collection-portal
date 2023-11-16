<script setup lang="tsx">
import { listData } from './data'
import Badge from '@/components/badge/Badge.vue'
// import dateFormat from 'dateformat'
import type { IListColumn } from '@/components/list/types'
import ListHolder from '@/components/list/ListHolder.vue'

type ITest = (typeof listData)[0]

const column: IListColumn<ITest>[] = [
  {
    id: 'status',
    name: 'Status',
    isSortable: true,
    width: 200,
    dataFiled: 'status',
    cell: true
  },
  {
    id: 'action',
    name: 'Action',
    isSortable: true,
    width: 200,
    dataFiled: 'status',
    cell: true
  }
]
</script>

<template>
  <ListHolder
    :onCreate="console.log"
    title=""
    :data="listData"
    :columns="column"
    :pagination="true"
  >
    <template #status="{ status }">
      <Badge class="success">
        <template v-slot:content> {{ status }}</template>
      </Badge>
    </template>
    <template #action="{ id }">
      <div
        @click="console.log(id)"
        class="w-16 h-7 border rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
      >
        View
      </div>
    </template>
    <!-- <template #createdAt="{ createdAt }">
      {{ dateFormat(createdAt, 'dd mmm, yyyy') }}
    </template> -->
  </ListHolder>
</template>
