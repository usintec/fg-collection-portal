<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import BillService from '@/services/BillService'
import { useBillStore } from '@/stores/billStore'
import type { IBillInvoiceModel } from '@/services/types'
import BillInvoice from '@/components/invoice/BillInvoice.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  detailPage: boolean
}>()

const bill = ref<IBillInvoiceModel>()
const billStore = useBillStore()
const loading = ref(false)
const router = useRouter()

const getPreview = () => {
  if (Object.keys(billStore.bill).length === 0) return router.push('/bills')
  try {
    bill.value = billStore.bill as unknown as IBillInvoiceModel
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}

const getDetail = async () => {
  if (!billStore.detailBillId) return router.push('/bills')
  try {
    loading.value = true
    const res = await BillService.billById(billStore.detailBillId)
    bill.value = res
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}

onMounted(async () => {
  if (props.detailPage) {
    await getDetail()
  } else {
    getPreview()
  }
})
onUnmounted(() => {
  billStore.clearBill()
})
</script>
<template>
  <div v-if="!loading && bill">
    <BillInvoice :bill="bill" :preview="true"></BillInvoice>
  </div>
</template>
