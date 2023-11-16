<script setup lang="ts">
import TabItems from '../tab/TabItems.vue'
import Tsa from '@/components/organizations/Tsa.vue'
import BillingCircles from '../organizations/BillingCircles.vue'
import Role from '../organizations/Role.vue'
import { Permissions } from '@/stores/permissionStore'

const tabs = [
  {
    name: 'Billing Settings'
  },
  {
    name: 'TSA Accounts',
    permissions: [Permissions.CreateTsaSettings, Permissions.UpdateTsaSettings]
  },
  {
    name: 'Roles',
    permissions: [Permissions.ViewAllRole]
  }
]
</script>

<template>
  <div class="flex justify-center my-8 mx-8">
    <TabItems class="px-4 rounded-3xl h-full" :tabs="tabs">
      <template v-slot:tab-0>
        <BillingCircles />
      </template>

      <template v-slot:tab-1>
        <Tsa />
      </template>

      <template v-slot:tab-2>
        <Role />
      </template>
    </TabItems>
  </div>
</template>
