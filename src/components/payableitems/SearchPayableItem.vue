<script setup lang="ts">
import TypeHead from '@/components/inputs/typehead/TypeHead.vue'
import { type PayableItemModel, type IOption } from '@/services/types'
import BillService from '@/services/BillService'
import { useOrganizationStore } from '@/stores/organizationStore'
import { computed, onMounted, ref, watch } from 'vue'
import PayableDynamicForm from './PayableDynamicForm.vue'

const props = defineProps<{ class?: string }>()

const orgStore = useOrganizationStore()

const emit = defineEmits<{
  (e: 'onRowClick', value: PayableItemModel): void
}>()

const text = ref('')
const payableItems = ref<PayableItemModel[]>([])
const loading = ref(false)

const showForm = ref(false)
const payableItemId = ref('')
const additionalInformation = ref<Record<string, any>>({})

onMounted(async () => {
  const items = await BillService.searchPayableItem(orgStore.fg_id ?? '', '')
  payableItems.value = items
})

watch(text, async (value) => {
  loading.value = true
  const res = await BillService.searchPayableItem(orgStore.fg_id ?? '', value)
  payableItems.value = res
  loading.value = false
})

const mapper = (item: PayableItemModel) => {
  return {
    label: `${item.name} - ${item.gifmisCode}`,
    value: item.payableItemId
  }
}

const options = computed({
  get() {
    return payableItems.value.map(mapper)
  },
  set(value) {
    console.log(value)
  }
})

const onRowClick = (v: IOption) => {
  const item = payableItems.value.find((c) => c.payableItemId === v.value)
  if (!item) return
  emit('onRowClick', item)
  if (Object.keys(item.additionalInformation ?? {}).length > 0) {
    additionalInformation.value = item.additionalInformation
    payableItemId.value = item.payableItemId
    showForm.value = true
  }
  text.value = ''
}
</script>
<template>
  <TypeHead
    label="Search and Add Line Items"
    important
    :value="text"
    :options="options"
    @onChange="(value) => (text = value)"
    placeholder="Search by name, GIFMIS, or item code"
    :class="props.class"
    @onRowSelect="onRowClick"
    :loading="loading"
  />
  <PayableDynamicForm
    :show="showForm"
    :form="additionalInformation"
    :id="payableItemId"
    @close="() => (showForm = false)"
  />
</template>
