<script setup lang="ts">
import type { IListColumn } from '@/components/list/types'
import Badge from '@/components/badge/Badge.vue'
import type { ICustomer } from '@/services/types'
import CustomerService from '@/services/CustomerService'
import { ref, onMounted, computed } from 'vue'
// import { currencyEnum } from '@/components/card/types'
// import CardItem from '@/components/card/CardItem.vue'
import { usePageNameStore } from '@/stores/pageName'
import CustomerForm from './CustomerForm.vue'
import ListHolder from '../list/ListHolder.vue'
import { Permissions } from '@/stores/permissionStore'

const customer = ref<ICustomer[]>([])
const menuStore = usePageNameStore()
const loading = ref(true)

const showCustomerModal = ref(false)

const column: IListColumn<ICustomer>[] = [
  {
    id: 'name',
    name: 'Name',
    isSortable: true,
    width: 300,
    dataFiled: 'name'
  },
  {
    id: 'email',
    name: 'Email Address',
    isSortable: true,
    width: 200,
    dataFiled: 'email'
  },
  {
    id: 'phone',
    name: 'Phone Number',
    isSortable: true,
    width: 200,
    dataFiled: 'phoneNumber'
  },
  {
    id: 'type',
    name: 'Customer Type',
    isSortable: true,
    width: 200,
    dataFiled: 'customerType'
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

// const myCardData1 = {
//   title: 'All Customers',
//   icon: '',
//   currency: currencyEnum.NONE,
//   amount: '0',
//   itemCount: '5',
//   itemPercentage: '80'
// }

const pull = async () => {
  loading.value = true
  const data = await CustomerService.getAll()
  customer.value = data
  loading.value = false
}

onMounted(() => {
  menuStore.setPageName('All Customers')
  pull()
})

const close = () => {
  showCustomerModal.value = false
  pull()
}

const searchTerm = ref<string>('')

const filteredCustomers = computed(() => {
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
  return customer.value.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchTerm))
})
</script>

<template>
  <div class="pb-10">
    <ListHolder
      :loading="loading"
      :data="filteredCustomers"
      :columns="column"
      :pagination="true"
      title="Customer"
      :createPermission="[Permissions.CreateCustomer]"
      :searchPermission="[Permissions.SearchCustomer]"
      :onCreate="() => (showCustomerModal = true)"
    >
      <template #status="{}">
        <Badge class="success">
          <template v-slot:content> {{ 'active' }}</template>
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
    </ListHolder>
  </div>
  <CustomerForm :show="showCustomerModal" @closeModal="close" />
</template>
