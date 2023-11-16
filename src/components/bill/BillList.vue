<script setup lang="ts">
import type { IListColumn } from '../list/types'
import Badge from '../badge/Badge.vue'
import type { IBill } from '@/services/types'
import BillService from '@/services/BillService'
import { ref, onMounted } from 'vue'
// import { currencyEnum } from '../card/types'
// import CardItem from '../card/CardItem.vue'
import { usePageNameStore } from '@/stores/pageName'
import { useRouter } from 'vue-router'
import { useBillStore } from '@/stores/billStore'
import { useCreateBillStore } from '@/stores/createBillStore'
import dateFormat from 'dateformat'
import ListHolder from '../list/ListHolder.vue'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

const loading = ref(true)
const bill = ref<IBill[]>([])
const filteredBills = ref<IBill[]>([])
const menuStore = usePageNameStore()
const billStore = useBillStore()
const createBillStore = useCreateBillStore()

const router = useRouter()
const column: IListColumn<IBill>[] = [
  {
    id: 'ref',
    name: 'Bill Number',
    isSortable: true,
    width: 200,
    dataFiled: 'billNumber'
  },
  {
    id: 'dueDate',
    name: 'Due Date',
    isSortable: true,
    width: 300,
    dataFiled: 'dueDate',
    cell: true
  },
  {
    id: 'customer',
    name: 'Customer',
    isSortable: true,
    width: 200,
    dataFiled: 'customerName'
  },
  {
    id: 'customerPhoneNumber',
    name: 'Customer Phone',
    isSortable: true,
    width: 200,
    dataFiled: 'customerPhoneNumber'
  },
  {
    id: 'createdOn',
    name: 'Created On',
    isSortable: true,
    width: 200,
    dataFiled: 'customerId',
    cell: true
  },
  {
    id: 'invoiceCount',
    name: 'Invoices',
    isSortable: true,
    width: 200,
    dataFiled: 'invoiceCount',
    cell: true,
    permissions: [Permissions.ViewAllInvoices]
  },
  {
    id: 'status',
    name: 'Status',
    isSortable: true,
    width: 200,
    dataFiled: 'billId',
    cell: true
  }
]

// const myCardData = {
//   title: 'All Bill Items',
//   icon: '',
//   currency: currencyEnum.NONE,
//   amount: '0',
//   itemCount: '5',
//   itemPercentage: '80'
// }

// const myCardData1 = {
//   title: 'All Customers',
//   icon: '',
//   currency: currencyEnum.NONE,
//   amount: '0',
//   itemCount: '5',
//   itemPercentage: '80'
// }

// const myCardData2 = {
//   title: 'Invoices',
//   icon: '',
//   currency: currencyEnum.NONE,
//   amount: '0',
//   itemCount: '5',
//   itemPercentage: '80'
// }

onMounted(async () => {
  menuStore.setPageName('All Bill Items')
  menuStore.turnOffSubMenu()
  const bills = await BillService.getAll()
  bill.value = bills
  filteredBills.value = bills
  loading.value = false
})

const pushCreate = () => {
  createBillStore.clear()
  router.push('/bills/create-bill')
}

const goToInvoices = (id: string) => {
  billStore.setDetailBill(id)
  router.push(`/bills/${id}/invoices`)
}
</script>

<template>
  <CheckPermission :permission="Permissions.ViewAllBills">
    <div class="pb-10">
      <!-- <div
        class="h-[213px] flex px-2 py-12 items-center justify-between bg-white rounded-[23px] mx-8 my-8"
      >
        <div class="flex gap-5">
          <CardItem :card="myCardData" />
          <CardItem :card="myCardData2" class="bg-[#E8E4FF]" />
        </div>
      </div> -->

      <ListHolder
        :data="bill"
        :columns="column"
        title="Bill"
        :onCreate="pushCreate"
        :onRowClick="console.log"
        pagination
        :createPermission="[Permissions.CreateBill]"
        :loading="loading"
      >
        <template #status="{ status }">
          <Badge :class="status === 'Unpaid' ? 'warning' : 'success'">
            <template v-slot:content> {{ status }}</template>
          </Badge>
        </template>
        <template #dueDate="{ dueDate }">
          {{ dateFormat(dueDate, 'dd/mm/yy') }}
        </template>
        <template #createdOn="{ createdOn }">
          {{ dateFormat(createdOn.split('T')[0], 'dd/mm/yy') }}
        </template>
        <template #invoiceCount="{ invoiceCount, id }">
          <CheckPermission :permission="Permissions.ViewAllInvoices">
            <div
              @click="() => goToInvoices(id)"
              class="w-20 cursor-pointer hover:text-dark_green h-7 border rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
            >
              {{ invoiceCount }} {{ invoiceCount === 1 ? 'Invoice' : 'Invoices' }}
            </div></CheckPermission
          >
        </template>
      </ListHolder>
    </div>
  </CheckPermission>
</template>
