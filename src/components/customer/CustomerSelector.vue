<script setup lang="ts">
import TypeHead from '@/components/inputs/typehead/TypeHead.vue'
import CustomerService from '@/services/CustomerService'
import type { ICustomerRead, IOption } from '@/services/types'
import { computed, onMounted, ref, watch } from 'vue'
import CustomerForm from './CustomerForm.vue'

const emit = defineEmits<{
  (e: 'onRowClick', value: ICustomerRead): void
}>()

const text = ref('')
const customers = ref<ICustomerRead[]>([])
const customerForm = ref(false)
const loading = ref(false)

onMounted(() => {
  CustomerService.search('').then((res) => {
    customers.value = res
  })
})

const mapper = (customer: ICustomerRead) => {
  return {
    label: `${customer.name} - ${customer.phoneNumber}`,
    value: customer.id
  }
}

watch(text, async (value) => {
  loading.value = true
  const res = await CustomerService.search(value)
  customers.value = res
  loading.value = false
})

const options = computed({
  get() {
    return customers.value.map(mapper) ?? []
  },
  set(value) {
    console.log(value)
  }
})

const onRowClick = (v: IOption) => {
  const customer = customers.value.find((c) => c.id === v.value)
  if (!customer) return
  emit('onRowClick', customer)
  text.value = v.label
}

const show = () => (customerForm.value = true)
const close = () => (customerForm.value = false)
</script>
<template>
  <TypeHead
    label="Search and Select customer"
    important
    showAddButton
    :value="text"
    :options="options"
    @onChange="(value) => (text = value)"
    @addNew="show"
    placeholder="Search by surname, phone number or email"
    @onRowSelect="onRowClick"
    :loading="loading"
  />

  <CustomerForm :show="customerForm" @closeModal="close" />
</template>
