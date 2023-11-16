<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DynamicFormSettings from '../dynamic-form/DynamicFormSettings.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import OrganizationService from '@/services/OrganizationService'
import type { IBillingSettings } from '@/services/types'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'

interface Props {
  width?: string
  submitData?: boolean
}
const props = defineProps<Props>()
const billSettings = ref<Partial<IBillingSettings>[]>([])
const loading = ref(true)

const removeAt = (billingId: string) => {
  if (billSettings.value.length <= 1) return
  const index = billSettings.value.findIndex((setting) => setting.id == billingId)
  if (index >= 0) billSettings.value.splice(index, 1)
}

const addNewFiled = async () => {
  await getBillingSettings()
  billSettings.value.push({
    billingRate: 0,
    currencyCode: 'NGN',
    billingFrequncy: 1,
    billingCycle: ''
  })
}
const getBillingSettings = async () => {
  billSettings.value = await OrganizationService.getBillingSettings()
}
onMounted(async () => {
  try {
    await getBillingSettings()
    billSettings.value.push({
      billingRate: 0,
      currencyCode: 'NGN',
      billingFrequncy: 1,
      billingCycle: ''
    })
    loading.value = false
  } catch (err) {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <div>
      <h3 class="text-sm font-medium">Billing Circles</h3>
      <p class="text-[#8492B6] text-xs font-normal pt-5">
        Setup billing circles for all bills that goes for your organization
      </p>
    </div>

    <div class="my-7 w-full">
      <div class="mx-3 flex justify-between border-b pb-2 pl-6">
        <p class="text-xs flex items-center justify-center gap-2 pl-20">
          Bill Currency
          <span class="text-[#36A55B]"><MaterialIcon icon="help" class="text-lg" /></span>
        </p>

        <p class="text-xs flex items-center justify-center gap-2 pl-20">
          Type of fee
          <span class="text-[#36A55B]"><MaterialIcon icon="help" class="text-lg" /></span>
        </p>

        <p class="text-xs flex items-center justify-center gap-2 pl-20">
          Frequency
          <span class="text-[#36A55B]"><MaterialIcon icon="help" class="text-lg" /></span>
        </p>

        <p class="text-xs flex items-center justify-center gap-2 pl-20">
          Billing Amount
          <span class="text-[#36A55B]"><MaterialIcon icon="help" class="text-lg" /></span>
        </p>

        <p class="text-xs"></p>

        <p class="text-xs"></p>
      </div>
      <div class="flex justify-center pt-3" v-if="loading">
        <SpinnerComponent />
      </div>
      <div
        v-else
        class="mx-3 my-5 rounded-lg border py-2 px-4"
        v-for="item in billSettings"
        :key="item.id"
      >
        <DynamicFormSettings
          :class="props.width ?? 'w-2/3'"
          :item="item"
          @remove="(v) => removeAt(v)"
          @add="addNewFiled"
        />
      </div>
    </div>
  </div>
</template>
