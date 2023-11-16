<script setup lang="ts">
import MaterialIcon from '../icon/MaterialIcon.vue'
import { ref, onMounted, watch } from 'vue'
import {
  CombineLogic,
  type IBillInvoiceModel,
  type LineItem,
  type PriceAdjustmentModel
} from '@/services/types'
import ItemDetail from '@/components/itemdetail/ItemDetail.vue'
import InvoiceTopBar from '@/components/invoice/InvoiceTopBar.vue'
import Toggle from '../inputs/toggle/Toggle.vue'
import CheckBox from '../inputs/check/CheckBox.vue'
import BillService from '@/services/BillService'
import InvoiceService from '@/services/InvoiceService'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import PriceAdjustment from './PriceAdjustment.vue'
import { useToast } from 'vue-toastification'
import { usePageNameStore } from '@/stores/pageName'
import { useRouter } from 'vue-router'
import dateFormat from 'dateformat'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

const selectedInvoice = ref(0)
// const partialPayment = ref(false)
const props = defineProps<{
  billId?: string
  preview?: boolean
  bill?: IBillInvoiceModel
}>()
const isCheckedEmail = ref(false)
const isCheckedSMS = ref(false)
const loading = ref(true)
const loadingPartialPayment = ref(false)
const billInvoice = ref<IBillInvoiceModel>()
const menuStore = usePageNameStore()
const errorMessage = ref<Partial<PriceAdjustmentModel>>()
const router = useRouter()

const selectInvoice = (invoiceIndex: number) => {
  selectedInvoice.value = invoiceIndex
}
const togglePartialPayment = async () => {
  try {
    if (billInvoice.value?.invoices[selectedInvoice.value].id) {
      loadingPartialPayment.value = true
      billInvoice.value.invoices[selectedInvoice.value].allowPartialPayment =
        !billInvoice.value?.invoices[selectedInvoice.value]?.allowPartialPayment
      form.value.allowPartialPayment =
        billInvoice.value?.invoices[selectedInvoice.value]?.allowPartialPayment
      await InvoiceService.partialPayment(
        billInvoice.value?.invoices[selectedInvoice.value].id,
        form.value
      )
      loadingPartialPayment.value = false
    }
  } catch (err) {
    loadingPartialPayment.value = false
    if (billInvoice.value?.invoices[selectedInvoice.value].id)
      billInvoice.value.invoices[selectedInvoice.value].allowPartialPayment =
        !billInvoice.value?.invoices[selectedInvoice.value]?.allowPartialPayment
    form.value.allowPartialPayment =
      billInvoice.value?.invoices[selectedInvoice.value]?.allowPartialPayment
  }
}
const onCheck = (option: string) => {
  option == 'email'
    ? (isCheckedEmail.value = !isCheckedEmail.value)
    : (isCheckedSMS.value = !isCheckedSMS.value)
}
const smsCharges = ref(25)
const toast = useToast()
const formatMoney = (value: number | string | undefined) => {
  const num = Number(value)
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
const priceAdjustmentMandatoryField: (keyof PriceAdjustmentModel)[] = ['type', 'amount']
const errorMessages = (keys: (keyof PriceAdjustmentModel)[]) => {
  let error = false
  for (const key of keys) {
    if (!form.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}
const setErrorMessage = (key: keyof PriceAdjustmentModel, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}
onMounted(async () => {
  menuStore.turnONSubMenu()
  if (props.preview) {
    loading.value = false
    billInvoice.value = props.bill
  } else {
    const billId = props.billId
    if (!billId) return
    try {
      const api = await BillService.billById(billId)
      billInvoice.value = api
      billInvoice.value.invoices[selectedInvoice.value].priceAdjustments.forEach((adjustment) => {
        const lineItem: LineItem = {
          id: radomStr(),
          description: adjustment.description ?? '',
          name: adjustment.type ?? '',
          quantity: 1,
          price: Number(adjustment.amount),
          tax: { type: '', value: 0 },
          gifmisCode: '',
          total: Number(adjustment.amount)
        }
        billInvoice.value?.invoices[selectedInvoice.value].lineItems.push(lineItem)
      })
      loading.value = false
    } catch (err) {
      loading.value = false
    }
  }
})
const form = ref<Partial<PriceAdjustmentModel>>({})
const priceAdjustmentLoading = ref(false)
const setForm = (v: Partial<PriceAdjustmentModel>) => {
  form.value = v
}
const radomStr = () => `${Math.random()}`.slice(2)
const addNewFiled = async () => {
  try {
    if (errorMessages(priceAdjustmentMandatoryField)) return
    else errorMessage.value = undefined
    if (billInvoice.value?.invoices[selectedInvoice.value].id) {
      priceAdjustmentLoading.value = true
      const res = await InvoiceService.addPriceIncrement(
        billInvoice.value?.invoices[selectedInvoice.value].id,
        form.value
      )
      if (res) {
        billInvoice.value.invoices[selectedInvoice.value].subTotal = res.subTotal
        billInvoice.value.invoices[selectedInvoice.value].total = res.total
        billInvoice.value.invoices[selectedInvoice.value].amountDue = res.amountDue
        billInvoice.value.invoices[selectedInvoice.value].amountPaid = res.amountPaid
        const lineItem: LineItem = {
          id: radomStr(),
          description: form.value.description ?? '',
          name: form.value.type ?? '',
          quantity: 1,
          price: Number(form.value.amount),
          tax: { type: '', value: 0 },
          gifmisCode: '',
          total: Number(form.value.amount)
        }
        billInvoice.value?.invoices[selectedInvoice.value].lineItems.push(lineItem)
        const emptyAdjustment: PriceAdjustmentModel = { description: '', amount: '', type: '' }
        setForm(emptyAdjustment)
      }
      priceAdjustmentLoading.value = false
      toast.success('Price Adjustment created successfully')
    }
  } catch (err) {
    priceAdjustmentLoading.value = false
  }
}
const _currencyCode = (code: string): number => {
  switch (code) {
    case 'NGN':
      return 8358
    case 'USD':
      return 36
    case 'EUR':
      return 8364
    case 'GBP':
      return 163
    default:
      return 1
  }
}

watch(
  () => menuStore._goBack,
  () => {
    if (props.billId) router.push('/bills')
    else router.push('/bills/create-bill')
    menuStore.setSubMenuId('')
  }
)
</script>
<template>
  <div>
    <div v-if="loading" class="items-center justify-center">
      <SpinnerComponent></SpinnerComponent>
    </div>
    <div v-else-if="!loading">
      <InvoiceTopBar
        v-if="!props.preview"
        class="pb-5"
        :status="billInvoice?.status ?? ''"
        :billId="billId ?? ''"
        :billNo="billInvoice?.billNumber ?? ''"
        :customerName="billInvoice?.customer.name ?? ''"
        :dueDate="billInvoice?.dueDate ?? ''"
      />
      <div
        :class="{
          'mt-10': preview
        }"
        class="bg-white rounded-3xl py-5 px-8 mx-8 font-satoshi"
      >
        <div>
          <h3 class="text-[#204458] text-md font-bold font-satoshi pb-3">
            Invoice Generated for Bill {{ billInvoice?.billNumber }}
          </h3>
        </div>
        <div class="flex gap-0">
          <div class="w-40 flex flex-col">
            <div
              :key="index"
              class="flex mb-3 font-bold justify-around gap-4 hover:cursor-pointer"
              :class="[selectedInvoice == index ? 'text-[#12A320]' : 'text-[#9CBBCD]']"
              @click="selectInvoice(index)"
              v-for="(_, index) in billInvoice?.invoices"
            >
              <p class="text-[15px]">Invoice {{ billInvoice?.invoices[index].currency }}</p>
              <MaterialIcon class="text-[15px] py-1" outline icon="arrow_forward_ios" />
            </div>
          </div>
          <div class="w-full bg-white rounded-xl border py-5 font-satoshi">
            <div class="flex justify-between px-3 mx-2">
              <div class="flex gap-3">
                <div class="w-24 h-24 rounded-md bg-[#DFE7FB] mb-7 text-center py-9">
                  <MaterialIcon class="mr-1" outline icon="photo_camera_back" />
                </div>
              </div>
              <div class="flex flex-col w-52">
                <p class="font-satoshi mb-3 text-dark_green font-bold text-lg">
                  {{ billInvoice?.invoices[selectedInvoice].invoiceNumber }}
                </p>
                <p class="font-satoshi text-dark_green text-sm">
                  {{ billInvoice?.organisation.address }}
                </p>
                <div class="flex flex-col gap-2">
                  <div
                    class="bg-[#56D07F] w-20 rounded-lg text-white text-center justify-center"
                    :class="{
                      'bg-[#e6bc54] text-white':
                        billInvoice?.invoices[selectedInvoice].status.toLowerCase() != 'paid'
                    }"
                  >
                    {{ billInvoice?.invoices[selectedInvoice].status }}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="flex justify-between pt-3 mb-6 px-3 mx-2">
              <div class="flex gap-3">
                <div class="w-48">
                  <p class="font-satoshi text-dark_green text-sm">Bill To:</p>
                  <p class="font-satoshi mb-3 text-dark_green font-bold text-md">
                    {{ billInvoice?.customer.name }}
                  </p>
                  <p class="font-satoshi text-dark_green text-sm">
                    Phone: {{ billInvoice?.customer.phoneNumber }}
                  </p>
                  <p class="font-satoshi text-dark_green text-sm">
                    Mobile: {{ billInvoice?.customer.phoneNumber }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col w-52 text-dark_green font-satoshi">
                <p><span class="font-bold text-md">Bill No:</span> {{ billInvoice?.billNumber }}</p>
                <p>
                  <span class="font-bold text-md">Issued Date:</span>
                  {{
                    dateFormat(
                      billInvoice?.invoices[selectedInvoice].createdDate.split('T')[0],
                      'dd/mm/yy'
                    )
                  }}
                </p>
                <p>
                  <span class="font-bold text-md">Due Date:</span>
                  {{ dateFormat(billInvoice?.invoices[selectedInvoice].dueDate, 'dd/mm/yy') }}
                </p>
                <p>
                  <span class="font-bold text-md">Amount: </span>
                  <span>{{
                    String.fromCharCode(
                      _currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                    )
                  }}</span>
                  {{ formatMoney(billInvoice?.invoices[selectedInvoice].total) }}
                </p>
              </div>
            </div>
            <div class="w-full">
              <ItemDetail
                :currency="billInvoice?.invoices[selectedInvoice].currency ?? ''"
                :itemList="billInvoice?.invoices[selectedInvoice].lineItems ?? []"
              >
              </ItemDetail>
            </div>
            <CheckPermission
              :combine-logic="CombineLogic.OR"
              :permission="[Permissions.IncrementInvoice, Permissions.RebateInvoice]"
            >
              <div v-if="!preview" class="pl-2 w-full flex-col flex py-3 border-t border-b">
                <div class="gap-3">
                  <div
                    class="w-full"
                    v-if="billInvoice?.invoices[selectedInvoice]?.status != 'Paid'"
                  >
                    <PriceAdjustment
                      class="w-full"
                      :loading="priceAdjustmentLoading"
                      :item="form"
                      @add="addNewFiled"
                      @change="(v: Partial<PriceAdjustmentModel>) => setForm(v)"
                      :errorMessage="errorMessage"
                    />
                  </div>
                </div>
              </div>
            </CheckPermission>
            <div class="flex mt-5">
              <div class="flex flex-col w-full">
                <div class="flex text-md text-dark_green w-full p-2">
                  <p class="w-1/2 text-[#2F3A61] text-md font-satoshi">
                    <span
                      v-if="
                        !props.preview && billInvoice?.invoices[selectedInvoice]?.status != 'Paid'
                      "
                      >Split bill payment (
                      {{
                        billInvoice?.invoices[selectedInvoice]?.allowPartialPayment
                          ? 'Enable'
                          : 'Disable'
                      }}
                      )</span
                    >
                  </p>
                  <p>Sub Total</p>
                </div>
                <div class="flex gap-3 w-full px-3">
                  <div class="pt-2 flex flex-col gap-2 w-full">
                    <div v-if="!preview" class="flex gap-2 mb-5">
                      <Toggle
                        v-if="billInvoice?.invoices[selectedInvoice]?.status != 'Paid'"
                        :isActive="
                          billInvoice?.invoices[selectedInvoice]?.allowPartialPayment ?? false
                        "
                        :onChange="togglePartialPayment"
                        :isLoading="loadingPartialPayment"
                      />
                    </div>
                    <div
                      class="flex gap-2 pt-2"
                      v-if="!preview && billInvoice?.invoices[selectedInvoice]?.status != 'Paid'"
                    >
                      <div
                        :class="{
                          'text-green-500': isCheckedEmail,
                          'text-dark_green': !isCheckedEmail
                        }"
                        class="flex items-center"
                      >
                        <CheckBox
                          :checked="isCheckedEmail"
                          @onChecked="() => onCheck('email')"
                          :activeGreen="isCheckedEmail"
                        />
                        <span class="text-sm font-medium"> Email </span>
                      </div>
                      <div
                        v-if="!preview && billInvoice?.invoices[selectedInvoice]?.status != 'Paid'"
                        :class="{
                          'text-green-500': isCheckedSMS,
                          'text-dark_green': !isCheckedSMS
                        }"
                        class="flex items-center"
                      >
                        <CheckBox
                          v-if="!props.preview"
                          :checked="isCheckedSMS"
                          @onChecked="() => onCheck('sms')"
                          :activeGreen="isCheckedSMS"
                        />
                        <span class="text-sm font-medium"></span>
                      </div>
                      <div class="flex w-full items-center">
                        <p class="text-sm font-medium font-satoshi">SMS charge: NGN 25.00</p>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-3 w-full">
                    <div class="flex justify-between">
                      <p>{{ billInvoice?.invoices[selectedInvoice].lineItems.length }} items</p>
                      <div class="text-center text-[#2F3A61] text-md font-bold font-satoshi">
                        <span>{{
                          String.fromCharCode(
                            _currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                          )
                        }}</span>
                        {{ formatMoney(billInvoice?.invoices[selectedInvoice].subTotal) }}
                      </div>
                    </div>
                    <div class="flex justify-between pb-3" v-if="isCheckedSMS">
                      <p>SMS</p>
                      <div class="text-center text-[#2F3A61] text-md font-bold font-satoshi">
                        <span>{{
                          String.fromCharCode(
                            _currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                          )
                        }}</span>
                        {{ smsCharges }}
                      </div>
                    </div>
                    <hr />
                    <div class="flex justify-between mt-2">
                      <p>TOTAL</p>
                      <div class="text-center text-[#2F3A61] text-md font-bold font-satoshi">
                        <span>{{
                          String.fromCharCode(
                            _currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                          )
                        }}</span>
                        <span v-if="isCheckedSMS">
                          {{
                            formatMoney(
                              (billInvoice?.invoices[selectedInvoice].subTotal ?? 0) + smsCharges
                            )
                          }}</span
                        >
                        <span v-if="!isCheckedSMS">{{
                          formatMoney(billInvoice?.invoices[selectedInvoice].subTotal)
                        }}</span>
                      </div>
                    </div>
                    <div class="flex justify-between mt-2">
                      <p>Amount Due</p>
                      <div class="text-center text-[#2F3A61] text-md font-bold">
                        <span>{{
                          String.fromCharCode(
                            _currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                          )
                        }}</span>
                        <span>
                          {{ formatMoney(billInvoice?.invoices[selectedInvoice].amountDue) }}</span
                        >
                      </div>
                    </div>
                    <div class="flex justify-between mt-2">
                      <p>Amount Paid</p>
                      <div class="text-center text-[#2F3A61] text-md font-bold">
                        <span>{{
                          String.fromCharCode(
                            _currencyCode(billInvoice?.invoices[selectedInvoice].currency ?? '')
                          )
                        }}</span>
                        <span>
                          {{ formatMoney(billInvoice?.invoices[selectedInvoice].amountPaid) }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="flex px-5 py-3 flex-col gap-1">
                  <span class="text-base text-dark_green font-medium">Notes / Terms</span>
                  <p class="text-[#687CA9] italic">{{ billInvoice?.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InvoiceTopBar
      v-if="!props.preview && !loading"
      class="pb-5"
      :status="billInvoice?.status ?? ''"
      :billId="billId ?? ''"
      :billNo="billInvoice?.billNumber ?? ''"
      :customerName="billInvoice?.customer.name ?? ''"
      :dueDate="billInvoice?.dueDate ?? ''"
    />
  </div>
</template>
