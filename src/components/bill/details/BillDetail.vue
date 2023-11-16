<script setup lang="ts">
import Badge from '@/components/badge/Badge.vue'
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import BillService from '@/services/BillService'
import type { IBillInvoiceModel } from '@/services/types'
import { useBillStore } from '@/stores/billStore'
import { usePageNameStore } from '@/stores/pageName'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BillCustomerDetail from './BillCustomerDetail.vue'

const pageStore = usePageNameStore()
const billStore = useBillStore()
const router = useRouter()

const bill = ref<IBillInvoiceModel>()

onMounted(async () => {
  if (!billStore.detailBillId) router.push('/bills')
  else {
    pageStore.turnONSubMenu()
    pageStore.setPageName('Bill Items Detail')
    pageStore.setSubMenuId('Bills')
    const res = await BillService.billById(billStore.detailBillId as string)
    bill.value = res
  }
})

const goBack = () => {
  router.push('/bills')
  pageStore.setPageName('Bills')
  pageStore.setSubMenuId('')
}

watch(() => pageStore._goBack, goBack)

const copyContent = (content: string) => {
  navigator.clipboard.writeText(content)
}
</script>
<template>
  <div class="p-8">
    <div class="w-full flex justify-between">
      <div class="flex flex-col">
        <div class="text-dark_green text-base font-bold">
          {{ `Bill [${bill?.billNumber}] for ${bill?.customer?.name ?? ''}` }}
        </div>
        <div class="text-[#4E8385] font-medium text-sm">
          view details for bill {{ bill?.billNumber ?? '' }}
        </div>
      </div>

      <div class="w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/12 text-dark_green">
        <ButtonInput
          bg="bg-[#CADFEB]"
          class="text-xs w-[220px] h-[46px] !text-dark_green"
          :onClick="goBack"
        >
          Go Back
        </ButtonInput>
      </div>
    </div>
    <div class="bg-white w-full flex flex-col px-7 py-4 mt-9 rounded-3xl">
      <div class="flex justify-between pb-7 border-b-[1px] border-b-[#D5DCEE]">
        <div class="flex items-center">
          <div class="w-[97px] h-[59px] rounded-lg bg-[#DEE7F1] flex items-center justify-center">
            <MaterialIcon outline icon="payments" class="text-[#7BA2B7]" />
          </div>
          <div class="flex flex-col ml-6">
            <div class="flex gap-2">
              <span class="text-dark_green text-base font-bold">
                {{ `Bill [${bill?.billNumber}]` }}
              </span>
              <Badge :class="bill?.status === 'Unpaid' ? 'warning' : 'success'">
                <template v-slot:content> {{ bill?.status }}</template>
              </Badge>
            </div>
            <div class="text-[#6A789A] font-medium text-sm flex item-center mt-2 gap-2">
              items: {{ bill?.lineItems?.length ?? 0 }} | Ref No: {{ bill?.billNumber ?? '' }}
              <MaterialIcon
                @click="() => copyContent(bill?.billNumber ?? '')"
                icon="content_copy"
                class="text-sm text-[#137CDC] hover:scale-105 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col text-[#47526D] justify-between items-center">
          <div class="text-sm font-medium">Payment due by:</div>
          <div class="font-bold text-lg">
            {{ bill?.dueDate?.split('T')[0] ?? '' }}
          </div>
        </div>
      </div>
      <div class="py-11 border-b border-[#D5DCEE] flex justify-between">
        <span class="text-[#606F92] text-base font-medium">Customer</span>
        <BillCustomerDetail v-if="bill?.customer" v-bind="bill?.customer" />
      </div>
      <div class="py-11 flex justify-between border-b border-[#D9DFF8]">
        <span class="text-[#606F92] text-base font-medium">Payable Items</span>
        <BillCustomerDetail v-if="bill?.customer" v-bind="bill?.customer" />
      </div>
    </div>
  </div>
</template>
