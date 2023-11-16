<script setup lang="ts">
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import BillService from '@/services/BillService'
import { useCreateBillStore } from '@/stores/createBillStore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CreateBill from './CreateBill.vue'

const router = useRoute()
const id = router.params.billId

const loading = ref(true)
const billCreateStore = useCreateBillStore()
// const orgStore = useOrganizationStore()

onMounted(async () => {
  const bill = await BillService.billById(id as string)
  billCreateStore.fromBill(bill)
  loading.value = false
})
</script>
<template>
  <div v-if="loading">
    <SpinnerComponent />
  </div>
  <CreateBill :editMode="true" v-else />
</template>
