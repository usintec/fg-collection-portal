<script setup lang="ts">
import TabItems from '../tab/TabItems.vue'
import PaymentGateways from '../organizations/PaymentGateways.vue'
import Settlement from '../organizations/Settlement.vue'
import EmailProvider from '../organizations/EmailProvider.vue'
import { Permissions } from '@/stores/permissionStore'

const tabs = [
  {
    name: 'Payment Gateways Configuration'
  },
  {
    name: 'Settlement Configuration'
  },
  {
    name: 'Email Configuration',
    permissions: [Permissions.GetNotificationPreference]
  }
]
</script>

<template>
  <div class="flex justify-center my-8 mx-8">
    <TabItems class="px-4 rounded-3xl h-full" :tabs="tabs">
      <template v-slot:tab-0>
        <PaymentGateways />
      </template>

      <template v-slot:tab-1>
        <Settlement />
      </template>

      <template v-slot:tab-2>
        <EmailProvider />
      </template>
    </TabItems>
  </div>
</template>
