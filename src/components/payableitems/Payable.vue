<script setup lang="ts">
import CardItem from '../card/CardItem.vue'
import { currencyEnum } from '../card/types'
import { onMounted, ref } from 'vue'
import { usePageNameStore } from '@/stores/pageName'
import { useRouter } from 'vue-router'
import type { IOrganizationReport, PayableItemModel } from '@/services/types'
import type { IListColumn } from '../list/types'
import PayableItemService from '@/services/PayableService'
import Badge from '../badge/Badge.vue'
import { useOrganizationStore } from '@/stores/organizationStore'
import PayableItemActivation from './PayableItemActivation.vue'
import ListHolder from '../list/ListHolder.vue'
import { Permissions } from '@/stores/permissionStore'
import ReportService from '@/services/ReportService'

interface status {
  payableItemId: string
  status: boolean
}
const menuStore = usePageNameStore()
const loading = ref(false)

const router = useRouter()

const column: IListColumn<PayableItemModel>[] = [
  {
    id: 'GIFIMS',
    name: 'GIFIMS Code',
    isSortable: true,
    dataFiled: 'gifmisCode',
    width: 200
  },
  {
    id: 'code',
    name: 'Item Code',
    isSortable: true,
    width: 200,
    dataFiled: 'code'
  },
  {
    id: 'payableItem',
    name: 'Payable Item Name',
    isSortable: true,
    width: 200,
    dataFiled: 'name'
  },
  {
    id: 'currency',
    name: 'Currency',
    isSortable: true,
    width: 200,
    dataFiled: 'currencyCode'
  },
  {
    id: 'price',
    name: 'Price',
    isSortable: true,
    width: 200,
    dataFiled: 'price',
    cell: true
  },
  {
    id: 'status',
    name: 'Status',
    isSortable: false,
    width: 200,
    dataFiled: 'isLocked',
    isFilterable: false,
    cell: true
  },
  {
    id: 'action',
    name: 'Action',
    isSortable: true,
    width: 200,
    dataFiled: 'payableItemId',
    cell: true
  }
]

const data = ref<PayableItemModel[]>([])
const report = ref<IOrganizationReport>()
const orgStore = useOrganizationStore()

const goToCreate = () => {
  menuStore.setSubMenu('Create Payable Item')
  router.push('payable-items/create')
}

const goToDetail = (id: string, organizationId: string = orgStore.fg_id ?? '') => {
  router.push({ path: 'payable-items/details', query: { id: id, organizationId: organizationId } })
}

onMounted(async () => {
  const [res, payableItemCount] = await Promise.all([
    PayableItemService.getAll(orgStore.fg_id ?? ''),
    ReportService.getOrganizationReport()
  ])
  data.value = res
  report.value = payableItemCount
})
const itemStatusCallBack = (payableItemStatus: status) => {
  data.value.forEach((item) => {
    if (item.payableItemId == payableItemStatus.payableItemId) {
      item.isLocked = payableItemStatus.status
    }
  })
}
</script>

<template>
  <div class="pb-10">
    <div
      class="h-[213px] flex px-2 py-12 items-center justify-between bg-white rounded-[23px] mx-8 my-8"
    >
      <div class="flex gap-5">
        <CardItem
          :card="{
            title: 'Payable Items',
            icon: 'collections_bookmark',
            currency: currencyEnum.NONE,
            amount: report?.payableItemCount.toString() ?? '',
            itemCount: report?.payableItemCount.toString() ?? '',
            itemPercentage: '80'
          }"
          class="bg-[#E1E1FA]"
        />
      </div>
    </div>

    <ListHolder
      title="Payable Items"
      :data="data"
      :columns="column"
      :pagination="true"
      :loading="loading"
      :onCreate="goToCreate"
      :create-permission="[Permissions.CreatePayableItem]"
      :bulk-permission="[Permissions.UploadBulkPayableItem]"
    >
      <template #status="{ isLocked, payableItemId }">
        <Badge class="success">
          <template v-slot:content>
            <PayableItemActivation
              class="hover:scale-105 cursor-pointer"
              :isLocked="isLocked"
              :organizationId="orgStore.fg_id"
              :payableItemId="payableItemId"
              @statusUpdated="itemStatusCallBack"
            >
            </PayableItemActivation>
          </template>
        </Badge>
      </template>
      <template #price="{ price, priceRange }">
        <div v-if="price">{{ `${price}` }}</div>
        <div v-else-if="priceRange">
          {{ `${priceRange.min} - ${priceRange.max}` }}
        </div>
      </template>
      <template #action="{ payableItemId }">
        <div
          @click="() => goToDetail(payableItemId)"
          class="w-16 h-7 border pointer-cursor hover:scale-105 rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
        >
          View
        </div>
      </template>
    </ListHolder>
  </div>
</template>
