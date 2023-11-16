<script setup lang="ts">
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import type { IPayableItemActivation } from '@/services/types'
import PayableItemService from '@/services/PayableService'
import { ref } from 'vue'

interface status {
  payableItemId: string
  status: boolean
}
const loading = ref(false)
const props = defineProps<{
  organizationId?: string
  payableItemId: string
  isLocked: boolean
}>()
const emit = defineEmits<{
  (e: 'statusUpdated', value: status): void
}>()
const updatePayableItemActivationStatus = async () => {
  if (!props.organizationId) return
  const payableItem: IPayableItemActivation = {
    organizationId: props.organizationId,
    payableItemId: props.payableItemId
  }
  try {
    loading.value = true
    props.isLocked
      ? await PayableItemService.activate(payableItem)
      : await PayableItemService.deactivate(payableItem)
    loading.value = false
    emit('statusUpdated', { payableItemId: props.payableItemId, status: !props.isLocked })
  } catch (error) {
    loading.value = false
  }
}
</script>
<template>
  <div>
    <span v-if="!loading">
      <span @click="updatePayableItemActivationStatus">
        <span v-if="!isLocked"> Dactivate </span>
        <span v-if="isLocked"> Activate </span>
      </span>
    </span>
    <span v-else-if="loading">
      <SpinnerComponent></SpinnerComponent>
    </span>
  </div>
</template>
