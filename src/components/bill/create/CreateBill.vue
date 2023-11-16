<script setup lang="ts">
import CustomerSelector from '@/components/customer/CustomerSelector.vue'
import SingleCustomer from '@/components/customer/SingleCustomer.vue'
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import SelectInput from '@/components/inputs/select/SelectInput.vue'
import router from '@/router'
import type { IBill } from '@/services/types'
import { usePageNameStore } from '@/stores/pageName'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import LookUpService from '@/services/LookUpService'
import SearchPayableItem from '@/components/payableitems/SearchPayableItem.vue'
import BillItems from './BillItems.vue'
import { usePayableItems } from '@/stores/payableItemStore'
import BillSummery from './BillSummery.vue'
import BillExtraNote from './BillExtraNote.vue'
import { useOrganizationStore } from '@/stores/organizationStore'
import BillService from '@/services/BillService'
import { useToast } from 'vue-toastification'
import { useBillStore } from '@/stores/billStore'
import { useCreateBillStore } from '@/stores/createBillStore'
import { useRoute } from 'vue-router'

const props = defineProps<{
  editMode?: boolean
}>()

const pageStore = usePageNameStore()
const store = usePayableItems()
const createBillStore = useCreateBillStore()
const billStore = useBillStore()
const orgStore = useOrganizationStore()

const route = useRoute()
const id = route.params.billId
const toast = useToast()

onMounted(async () => {
  pageStore.setPageName('New Bill Item')
  pageStore.turnONSubMenu()
  const frequency = await LookUpService.billFrequency()
  const billingType = await LookUpService.billingTypes()
  if (!props.editMode) {
    const billId = await BillService.generateBillId()
    setState('billNumber', billId)
  }
  lookUp.value = {
    frequency,
    billingType
  }

  lookUpLoader.value = false
})

onUnmounted(() => {
  pageStore.turnONSubMenu()
})

watch(
  () => pageStore._goBack,
  () => {
    router.push(props.editMode ? `/bills/${id}/invoices` : '/bills')
    createBillStore.clear()
    pageStore.setSubMenuId('')
  }
)

const lookUp = ref<Record<string, any[]>>({})
const lookUpLoader = ref(false)
const loading = ref(false)

const setState = createBillStore.setState

const setErrorMessage = createBillStore.setErrorMessage

const customerClick = createBillStore.customerClick

const setInterval = (v: string) => {
  const freq = lookUp.value['frequency'].find((f) => f.label === v)
  if (freq) {
    setState('recurring', freq)
    setErrorMessage('recurring', '')
  } else {
    setErrorMessage('recurring', 'Please select a valid option')
  }
}

const removeCustomer = createBillStore.removeCustomer

const diffInDays = computed(() => {
  const state = createBillStore.state
  if (state.dueDate) {
    const date1 = new Date(state.dueDate)
    const date2 = new Date()
    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `Within ${diffDays} days`
  }
  return ''
})

const pushPayableItem = createBillStore.pushPayableItem

const removeItem = createBillStore.removeItem

const save = async (preview: boolean) => {
  const s = createBillStore
  const state = s.state
  const error = []
  if (!s.customer) {
    setErrorMessage('customerId', 'Please select a customer')
    error.push('error')
  }
  if (!state.billNumber) {
    setErrorMessage('billNumber', 'Please enter a bill number')
    error.push('error')
  }

  if (!state.dueDate) {
    setErrorMessage('dueDate', 'Please enter a due date')
    error.push('error')
  }

  if (store.readyForCheckout().length === 0) {
    setErrorMessage('lineItems', 'please addItems')
    error.push('error')
  }
  if (error.length > 0) return

  const _bill: Partial<IBill> = {
    id: '',
    ...state,
    customerId: s.customer?.id,
    lineItems: store.readyForCheckout() as any,
    organisationId: orgStore.fg_id ?? ''
  }
  loading.value = true
  loading.value = false
  if (preview) {
    const res = await BillService.create(_bill, true)
    billStore.storeBill(res)
    router.push({ path: `/bills/view-bills` })
  } else {
    if (props.editMode) {
      await BillService.update(id.toString(), _bill)
      toast.success('Bill updated successfully')
      router.push(`/bills/${id.toString()}/invoices`)
    } else {
      const res = await BillService.create(_bill, false)
      toast.success('Bill created successfully')
      router.push(`/bills/${res.id}/invoices`)
    }
  }
}

const pageName = usePageNameStore()
const goBack = () => {
  pageName.goBack()
}
</script>
<template>
  <div class="m-8 bg-white rounded-3xl px-6 py-9">
    <div class="flex justify-between items-center mb-14">
      <span class="text-dark_green font-bold text-base">{{
        editMode ? `Edit ${createBillStore.state.billNumber}` : 'Create a new Bill'
      }}</span>
      <div class="flex 2xl:w-1/4 xl:1/3 xl:w-[55%] md:5/12 w-full lg gap-5">
        <div class="flex gap-5 w-full">
          <div class="w-2/4" v-if="!editMode">
            <ButtonInput
              bg="bg-[#D8E8F2]"
              class="!w-3/4 !text-dark_green"
              :onClick="() => save(true)"
            >
              Preview
            </ButtonInput>
          </div>
          <div class="w-2/4" v-if="editMode">
            <ButtonInput bg="bg-[#D8E8F2]" class="!w-3/4 !text-dark_green" :onClick="goBack">
              Go Back
            </ButtonInput>
          </div>
          <div class="w-2/4">
            <ButtonInput
              :loading="loading"
              bg="bg-[#27536B]"
              class="font-bold text-base"
              :onClick="() => save(false)"
            >
              Save and Continue
            </ButtonInput>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between items-center">
      <div class="flex flex-col w-[40%] gap-2 2xl:w-5/12 xl:w-5/12 lg:w-4/6 md:w-full">
        <CustomerSelector @onRowClick="customerClick" />
        <SingleCustomer
          v-if="createBillStore.customer"
          v-bind="createBillStore.customer"
          @onRemove="removeCustomer"
        />
      </div>
      <div class="flex flex-col w-full lg:w-1/3 gap-2">
        <TextInput
          label="Bill Number"
          placeholder="Bill Number"
          :value="createBillStore.state?.billNumber"
          disabled
          important="*"
          @change="(v) => setState('billNumber', v)"
          :errorMessage="createBillStore.errorMessage?.billNumber"
        />
        <div class="flex w-full gap-3">
          <SelectInput
            class="w-1/2"
            label="Bill Type"
            placeholder="Bill Type"
            :selected="createBillStore.type"
            value="value"
            :items="lookUp['billingType'] ?? []"
            important="*"
            :name="['name']"
            @change="createBillStore.setType"
          />
          <SelectInput
            v-if="createBillStore.type === 'recurring'"
            class="w-1/2"
            label="Frequency"
            placeholder="Frequency"
            :selected="createBillStore.state?.recurring?.label"
            value="label"
            :items="lookUp['frequency'] ?? []"
            important="*"
            :name="['label']"
            @change="setInterval"
            :errorMessage="createBillStore.errorMessage?.recurring?.label"
          />
          <TextInput
            v-else
            class="w-1/2"
            label="Due Date"
            placeholder="Due Date"
            :value="createBillStore.state?.dueDate"
            important="*"
            type="date"
            :min="new Date().toISOString().split('T')[0]"
            :description="diffInDays"
            :errorMessage="createBillStore.errorMessage?.dueDate"
            @change="(v) => setState('dueDate', v)"
          />
        </div>
      </div>
    </div>
    <div class="w-full h-[1px] pt-10 border-b" />
    <div class="py-10">
      <SearchPayableItem
        :class="createBillStore.errorMessage?.lineItems && 'border border-red-400'"
        class="2xl:w-5/12 xl:w-5/12 lg:w-4/6 md:w-full"
        @onRowClick="pushPayableItem"
      />
    </div>
    <div class="w-full gap-5">
      <BillItems :items="createBillStore.payableItems" @remove="removeItem" />
    </div>
    <BillSummery />
    <div class="my-4">
      <BillExtraNote :notes="createBillStore.state.note" @onChange="(v) => setState('note', v)" />
    </div>
    <div class="flex 2xl:w-1/4 xl:1/3 xl:w-[55%] md:5/12 w-full gap-5 ml-auto">
      <div class="flex gap-5 w-full">
        <div class="w-2/4" v-if="!editMode">
          <ButtonInput
            bg="bg-[#D8E8F2]"
            class="!w-3/4 !text-dark_green"
            :onClick="() => save(true)"
          >
            Preview
          </ButtonInput>
        </div>

        <div class="w-2/4" v-if="editMode">
          <ButtonInput bg="bg-[#D8E8F2]" class="!w-3/4 !text-dark_green" :onClick="goBack">
            Go Back
          </ButtonInput>
        </div>
        <div class="w-2/4">
          <ButtonInput
            :loading="loading"
            bg="bg-[#27536B]"
            class="font-bold text-base"
            :onClick="() => save(false)"
          >
            Save and Continue
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>
</template>
