<script setup lang="ts">
import BillInvoice from '@/components/invoice/BillInvoice.vue'
import CheckPermission from '@/components/permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const billId = route.params.billId
</script>

<template>
  <CheckPermission :permission="Permissions.ViewAllInvoices">
    <div>
      <BillInvoice :v-if="billId" :billId="(billId as string)" />
    </div>
  </CheckPermission>
</template>
