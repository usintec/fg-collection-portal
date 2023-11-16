<script setup lang="ts">
import dateFormat from 'dateformat'
import ListHolder from '../list/ListHolder.vue'
import { onMounted, reactive, ref } from 'vue'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { IBalance } from '@/services/types'
import type { IListColumn } from '../list/types'
import Badge from '../badge/Badge.vue'
import { usePageNameStore } from '@/stores/pageName'

const menuStore = usePageNameStore()

const states = reactive({
  balanceData: ref<IBalance[]>([]),
  orgStore: useOrganizationStore(),
  loading: false,
  isModalVisible: false
})

const column: IListColumn<IBalance>[] = [
  {
    id: 'createdAt',
    name: 'Date',
    isSortable: true,
    dataFiled: 'createdOn',
    width: 200,
    cell: true
  },
  {
    id: 'code',
    name: 'Account No',
    isSortable: true,
    width: 200,
    dataFiled: 'accountNumber'
  },
  {
    id: 'code',
    name: 'Account Name',
    isSortable: true,
    width: 200,
    dataFiled: 'accountName'
  },
  {
    id: 'code',
    name: 'Bank Name',
    isSortable: true,
    width: 200,
    dataFiled: 'bankName'
  },
  {
    id: 'code',
    name: 'Balance',
    isSortable: true,
    width: 200,
    dataFiled: 'balance'
  },
  {
    id: 'status',
    name: 'Status',
    isSortable: true,
    width: 200,
    dataFiled: 'bankName',
    cell: true
  },
  {
    id: 'action',
    name: 'Action',
    isSortable: true,
    width: 200,
    dataFiled: 'id',
    cell: true
  }
]

const modal = () => {
  states.isModalVisible = true
}

onMounted(() => {
  menuStore.setPageName('Account Balances')
})
</script>

<template>
  <div class="pb-10 mt-12">
    <ListHolder
      :onCreate="modal"
      title="All Accounts Balances"
      searchTitle="Search by account number"
      :data="states.balanceData"
      :columns="column"
      :pagination="true"
      :loading="states.loading"
      show
    >
      <template #status="{ id }">
        <Badge class="success">
          <template v-slot:content>
            <span @click="() => console.log(id)"> Active </span>
          </template>
        </Badge>
      </template>
      <template #action="{ id }">
        <div
          @click="() => console.log(id)"
          class="w-16 h-7 border pointer-cursor hover:scale-105 rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
        >
          View
        </div>
      </template>
      <template #createdAt="{ createdOn }">
        {{ dateFormat(createdOn, 'dd mmm, yyyy') }}
      </template>
    </ListHolder>
  </div>
</template>
