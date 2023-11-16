<script setup lang="ts">
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import { ref, onMounted } from 'vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import BillService from '@/services/BillService'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import dateFormat from 'dateformat'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

const router = useRouter()

const toast = useToast()
const loading = ref(false)
const loadingSubmit = ref(false)
const billStatus = ref('')
const props = defineProps<{
  billId: string
  billNo: string
  customerName: string
  dueDate: string
  status: string
}>()
const submitBill = async () => {
  loadingSubmit.value = true
  try {
    const res = await BillService.submitBill(props.billId)
    billStatus.value = res.billStatus
    loadingSubmit.value = false
    toast.success('Bill submited successfully')
  } catch (error) {
    loadingSubmit.value = false
  }
}
onMounted(() => {
  billStatus.value = props.status
})

const gotoEdit = () => {
  router.push(`/bills/${props.billId}/edit`)
}
</script>
<template>
  <div class="flex gap-5 justify-evenly bg-white rounded-3xl pt-9 py-5 px-8 m-8 font-satoshi">
    <div class="w-12 h-12 bg-[#DDEAF5] rounded-md text-center p-3">
      <MaterialIcon class="mr-1" outline icon="photo_camera_back" />
    </div>
    <div class="flex flex-col gap-3">
      <p class="font-satoshi font-bold text-dark_green">New Created Bill</p>
      <p class="text-[#5B6889] text-sm font-satoshi"><span>Bill: </span> {{ props.billNo }}</p>
    </div>
    <div class="flex flex-col gap-3">
      <p class="text-[#5B6889] text-md font-satoshi">Status</p>
      <div
        class="bg-[#56D07F] p-2 rounded-lg text-white text-center justify-center"
        :class="{ 'bg-[#e4c065] text-white': props.status?.toLowerCase() != 'paid' }"
      >
        {{ billStatus }}
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <p class="text-[#5B6889] text-md font-satoshi">Customer</p>
      <p class="font-satoshi font-bold text-dark_green">{{ props.customerName }}</p>
    </div>
    <div class="flex flex-col gap-3">
      <p class="text-[#5B6889] text-md font-satoshi">Due Date</p>
      <p class="font-satoshi font-bold text-dark_green">
        {{ dateFormat(props.dueDate, 'dd/mm/yy') }}
      </p>
    </div>
    <div class="flex gap-3">
      <CheckPermission :permission="Permissions.EditBill">
        <ButtonInput
          :loading="loading"
          class="h-[46px] w-[133px] text-[13px] bg-color"
          :onClick="gotoEdit"
        >
          Edit Bill
        </ButtonInput>
      </CheckPermission>
      <CheckPermission :permission="Permissions.CompleteBill">
        <ButtonInput
          :loading="loadingSubmit"
          class="h-[46px] w-[133px] text-[13px]"
          :onClick="submitBill"
        >
          Complete
        </ButtonInput>
      </CheckPermission>
    </div>
  </div>
</template>
