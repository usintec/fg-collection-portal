<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TsaAccount from './TsaAccount.vue'
import OrganizationService from '@/services/OrganizationService'
import type { ITsaSettings } from '@/services/types'
import SpinnerComponent from '../loader/SpinnerComponent.vue'

const loading = ref(true)
const tsaSettings = ref<Partial<ITsaSettings>[]>([])

const removeAt = async () => {
  tsaSettings.value = []
  await getTsaSettings()
  tsaSettings.value.push({
    bankName: '',
    bankCode: '',
    currencyCode: 'NGN',
    accountNumber: '',
    accountName: '',
    applicableToAll: true
  })
}
const addNewTsaForm = async () => {
  await getTsaSettings()
  tsaSettings.value.push({
    bankName: '',
    bankCode: '',
    currencyCode: 'NGN',
    accountNumber: '',
    accountName: '',
    applicableToAll: true
  })
}
const getTsaSettings = async () => {
  tsaSettings.value = await OrganizationService.getTsaSettings()
}
onMounted(async () => {
  try {
    await getTsaSettings()
    tsaSettings.value.push({
      bankName: '',
      bankCode: '',
      currencyCode: 'NGN',
      accountNumber: '',
      accountName: '',
      applicableToAll: true
    })
    loading.value = false
  } catch (error) {
    loading.value = false
  }
})
</script>
<template>
  <div class="w-full bg-white px-10 py-3">
    <div class="flex justify-between">
      <div>
        <p class="text-md text-dark_green font-bold">TSA Accounts for group of MDAs</p>
        <p class="text-sm text-[#8492B6] pt-4">Setup TSA account for multiple MDAs at once.</p>
      </div>
    </div>
    <div class="flex justify-center pt-3" v-if="loading">
      <SpinnerComponent />
    </div>
    <div v-else v-for="(tsa, i) in tsaSettings" :key="i">
      <TsaAccount :item="tsa" @add="addNewTsaForm" @remove="removeAt"></TsaAccount>
    </div>
  </div>
</template>
