<!-- eslint-disable no-empty -->
<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Breadcrumb from '../breadcrumb/Breadcrumb.vue'
import { useRouter } from 'vue-router'
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import Toggle from '../inputs/toggle/Toggle.vue'
import { onMounted, ref, watch } from 'vue'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import PayableItemService from '@/services/PayableService'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import LookUpService from '@/services/LookUpService'
import CurrencyInput from '../inputs/text/CurrencyInput.vue'
import type {
  PayableItemModel,
  StampDuty,
  Vat,
  PriceRange,
  INameValue,
  IPayableItemActivation
} from '@/services/types'
import { usePageNameStore } from '@/stores/pageName'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

const toast = useToast()

enum priceStateEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  NOT_INDICATED = 'not indicated'
}
enum itemStatus {
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate'
}

const router = useRouter()
const menuStore = usePageNameStore()

const loadingPayableItem = ref(true)
const itemEnabled = ref(false)
const vatEnabled = ref(false)
const priceState = ref(priceStateEnum.NOT_INDICATED)
const organizationId = ref()
const payableItemId = ref()
const lookUp = ref<Record<string, INameValue[]>>({})
const savedSetting = ref<{ name: string; image: string }>()
const data = ref<PayableItemModel>()
const route = useRoute()

const cancel = () => {
  router.push('/payable-items')
}

watch(() => menuStore._goBack, cancel)

const toggleItemStatus = () => {
  itemEnabled.value = !itemEnabled.value
  itemEnabled.value
    ? updatePayableItemActivationStatus(itemStatus.ACTIVATE)
    : updatePayableItemActivationStatus(itemStatus.DEACTIVATE)
}
const toggleVatStatus = () => {
  vatEnabled.value = !vatEnabled.value
  vatState.value.isApplyable = vatEnabled.value
}
const togglePrice = () => {
  if (priceState.value == priceStateEnum.ACTIVE) priceState.value = priceStateEnum.INACTIVE
  else if (priceState.value == priceStateEnum.INACTIVE) priceState.value = priceStateEnum.ACTIVE
  else {
    if (switchPriceState()) {
      priceState.value = priceStateEnum.INACTIVE
    } else priceState.value = priceStateEnum.ACTIVE
  }
}
const switchPriceState = () => {
  if (priceState.value == priceStateEnum.NOT_INDICATED) {
    if (data.value?.price == null) return true
    return false
  } else {
    if (priceState.value == priceStateEnum.ACTIVE) return true
    return false
  }
}
const formatPrice = (value: number | undefined) => {
  if (!value) return
  let val = (value / 1).toFixed(2).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
onMounted(async () => {
  const currencies = await LookUpService.currencies()
  const vatType = await LookUpService.vatTypes()
  lookUp.value = {
    currencies,
    vatType
  }

  if (route.query.id) {
    organizationId.value = route.query.organizationId?.toString()
    payableItemId.value = route.query.id.toString()
    try {
      data.value = await PayableItemService.payableItemById(
        payableItemId.value,
        organizationId.value
      )
      itemState.value = data.value
      vatState.value.type = data.value.vat.type
      stampState.value = data.value.stampDuty
      itemEnabled.value = !data.value.isLocked
      vatEnabled.value = data.value.vat.isApplyable

      savedSetting.value = {
        name: data.value.currencyCode ?? '',
        image: data.value.currencyCode
          ? `https://statics.fr-par-1.linodeobjects.com/currencies/${data.value.currencyCode.toLowerCase()}.svg`
          : ''
      }
      loadingPayableItem.value = false
    } catch (error) {}
    loadingPayableItem.value = false
  }
})
//state data
const itemState = ref<PayableItemModel>({} as PayableItemModel)
const stampState = ref<StampDuty>({} as StampDuty)
const vatState = ref<Vat>({} as Vat)
const priceRange = ref<PriceRange>({} as PriceRange)

//error messages data
const itemErrorMessage = ref<Partial<PayableItemModel>>()
const vatErrorMessage = ref<Partial<Vat>>()
const stampErrorMessage = ref<Partial<StampDuty>>()
const priceErrorMessage = ref<Partial<PriceRange>>()

//manage submit button loading status
const loadingItemDetails = ref(false)
const loadingItemActivation = ref(false)

//payable item keys
const itemDetailKeys: (keyof PayableItemModel)[] = ['name', 'code']

//set error meesages
const setPriceError = (key: keyof PriceRange, v?: string) => {
  priceErrorMessage.value = { ...priceErrorMessage.value, [key]: v }
}
const setItemErrorMessage = (key: keyof PayableItemModel, message: string) => {
  itemErrorMessage.value = { ...itemErrorMessage.value, [key]: message }
}
const itemErrorMessages = (keys: (keyof PayableItemModel)[]) => {
  let error = false
  for (const key of keys) {
    if (!itemState.value[key]) {
      setItemErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}

//set state
const setPriceRange = (key: keyof PriceRange, v: string) => {
  priceRange.value = { ...priceRange.value, [key]: v }
  setPriceError(key, undefined)
}
const setItemState = (key: keyof PayableItemModel, value: string | boolean) => {
  itemState.value = { ...itemState.value, [key]: value }
  itemErrorMessage.value = { ...itemErrorMessage.value, [key]: undefined }
}
const setVatState = (key: keyof Vat, value: string) => {
  if (key !== 'type') {
    vatState.value = { ...vatState.value, [key]: Number(value) }
  } else vatState.value = { ...vatState.value, [key]: value }
  vatErrorMessage.value = { ...vatErrorMessage.value, [key]: undefined }
}
const setStampState = (key: keyof StampDuty, value: string) => {
  stampState.value = { ...stampState.value, [key]: value }
  stampErrorMessage.value = { ...stampErrorMessage.value, [key]: undefined }
}

const submitItemDetail = async () => {
  if (itemErrorMessages(itemDetailKeys)) return
  loadingItemDetails.value = true
  try {
    itemState.value.vat = vatState.value
    itemState.value.stampDuty = stampState.value
    if (switchPriceState()) {
      itemState.value.priceRange = priceRange.value
      delete itemState.value.price
    }
    await PayableItemService.update(itemState.value)
    loadingItemDetails.value = false
    toast.success('Updated successfully')
  } catch (error) {
    loadingItemDetails.value = false
  }
}
const updatePayableItemActivationStatus = async (status: itemStatus) => {
  const payableItem: IPayableItemActivation = {
    organizationId: organizationId.value,
    payableItemId: payableItemId.value
  }
  try {
    loadingItemActivation.value = true
    status == itemStatus.ACTIVATE
      ? await PayableItemService.activate(payableItem)
      : await PayableItemService.deactivate(payableItem)
    loadingItemActivation.value = false
    status == itemStatus.ACTIVATE
      ? toast.success('Payable item activated successfully')
      : toast.success('Payable item deactivated successfully')
  } catch (error) {
    itemEnabled.value = !itemEnabled.value
    loadingItemActivation.value = false
  }
}
</script>

<template>
  <div class="pb-10">
    <div class="h-[68px] flex px-8 py-12 items-center justify-between">
      <Breadcrumb title="Service Item Details" name="View payable item details" />
      <div class="flex gap-4 justify-center items-center">
        <RouterLink to="/payable-items/create" class="w-[220px]">
          <ButtonInput class="text-xs w-[220px] h-[46px] bg-[#204458]" :onClick="cancel">
            New Payable Item
          </ButtonInput>
        </RouterLink>

        <ButtonInput class="text-xs w-[220px] h-[46px] btn-bg" :onClick="cancel">
          Go Back
        </ButtonInput>
      </div>
    </div>

    <div v-if="!loadingPayableItem" class="bg-white rounded-3xl py-12 px-8 mx-8">
      <div class="flex justify-between w-full pb-7">
        <div class="flex">
          <div
            class="w-[97px] h-[58px] bg-[#D8E9F2] rounded-[7px] flex justify-center items-center me-5"
          >
            <MaterialIcon icon="layers" class="text-[#9CBECF]" />
          </div>

          <div>
            <h5 class="text-base font-bold font-satoshi text-[#204458]">
              Service Payable Item [{{ data?.code }}]

              <span
                class="rounded-[100px] bg-[#D9F8E3] text-center text-xs font-satoshi text-[#346444] p-1 px-2"
                >Enabled</span
              >
            </h5>
            <span class="text-sm font-normal text-[#6A789A] font-satoshi pe-2">
              {{ data?.currencyCode }} | GIFMIS: {{ data?.gifmisCode }}
            </span>
            <span class=""
              ><MaterialIcon icon="content_copy" class="text-sm text-[#137CDC]"
            /></span>
          </div>
        </div>

        <div class="text-right">
          <h3 class="text-2xl text-[#204458] font-bold font-satoshi">
            <span v-if="data?.currencyCode == 'NGN'">&#8358;</span>
            <span v-else-if="data?.currencyCode == 'USD'">&#36;</span>
            <span v-if="data?.price">{{ formatPrice(data?.price) }}</span>
            <span v-else>
              {{ formatPrice(Number(data?.priceRange.min)) }} -
              {{ data?.currencyCode == 'NGN' ? '&#8358;' : '&#36;' }}
              {{ formatPrice(Number(data?.priceRange.max)) }}
            </span>
          </h3>
          <p class="text-sm text-[#47526D] font-medium font-satoshi">VAT: {{ data?.vat.fee }}</p>
        </div>
      </div>
      <hr />

      <div class="flex w-full px-3 font-satoshi py-5">
        <CheckPermission :permission="[Permissions.DeactivatePayableItem]">
          <div class="w-[45%]">
            <p class="text-sm font-medium not-italic pb-3">Item Details</p>
            <Toggle :isActive="itemEnabled" :onChange="toggleItemStatus" />
            <span class="text-[13px] font-medium font-satoshi"> Item Enabled </span>
            <span v-if="loadingItemActivation" class="pt-2">
              <SpinnerComponent></SpinnerComponent>
            </span>
          </div>
        </CheckPermission>
        <div class="w-[65%]">
          <div class="gap-2">
            <div class="grid grid-cols-2 mt-3">
              <div class="me-3">
                <TextInput
                  label="Item Name"
                  important="*"
                  :errorMessage="itemErrorMessage?.name"
                  placeholder="Service Payable Item"
                  type="text"
                  :onChange="(v) => setItemState('name', v)"
                  :value="itemState?.name"
                />
              </div>

              <div class="me-3">
                <TextInput
                  label="Item Code"
                  important="*"
                  :errorMessage="itemErrorMessage?.code"
                  placeholder="007865YC"
                  type="text"
                  :onChange="(v) => setItemState('code', v)"
                  :value="itemState?.code"
                />
              </div>
            </div>

            <div>
              <div class="grid grid-cols pt-3">
                <p class="text-dark_green text-sm font-medium font-satoshi">
                  Price and Currency (NGN) <span class="text-red-600">*</span>
                </p>
              </div>

              <div class="rounded-lg bg-[#F6F8FF] flex justify-around items-center">
                <div class="pe-4">
                  <Toggle :isActive="switchPriceState()" :onChange="togglePrice" />
                  <span class="text-[13px] font-medium font-satoshi" v-if="switchPriceState()">
                    Price Range
                  </span>
                  <span class="text-[13px] font-medium font-satoshi" v-if="!switchPriceState()">
                    Price
                  </span>
                </div>

                <div class="pe-4">
                  <div v-if="!switchPriceState()">
                    <TextInput
                      label=""
                      important=""
                      placeholder="250000"
                      type="number"
                      :errorMessage="itemErrorMessage?.price"
                      :onChange="(v) => setItemState('price', v)"
                      :value="itemState?.price"
                    />
                  </div>
                  <div v-if="switchPriceState()" class="flex w-full gap-3">
                    <div class="w-1/2">
                      <TextInput
                        label=""
                        placeholder="Min Price"
                        :errorMessage="priceErrorMessage?.min"
                        :onChange="(v) => setPriceRange('min', v)"
                        :value="itemState?.priceRange.min"
                      />
                    </div>
                    <div class="w-1/2">
                      <TextInput
                        label=""
                        important=""
                        placeholder="Max Price"
                        :errorMessage="priceErrorMessage?.max"
                        :onChange="(v) => setPriceRange('max', v)"
                        :value="itemState?.priceRange.max == null ? '' : data?.priceRange.max"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <CurrencyInput
                    label=""
                    :onChange="(v) => setItemState('currencyCode', v)"
                    :selectItem="(v) => setItemState('currencyCode', v)"
                    placeholder="Naira (NGN)"
                    type="text"
                    class="w-1/3 h-11"
                    readonly
                    :errorMessage="itemErrorMessage?.currencyCode"
                    :value="itemState.currencyCode"
                    :item="savedSetting"
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols mt-3">
              <div class="">
                <TextInput
                  label="Describe Item"
                  placeholder="Type here"
                  type="text"
                  :onChange="(v) => setItemState('description', v)"
                  :value="itemState?.description"
                  :errorMessage="itemErrorMessage?.description"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div class="flex w-full px-3 font-satoshi py-5">
        <div class="w-[45%]">
          <p class="text-sm font-medium not-italic pb-3">VAT and Stamp Duty</p>
          <Toggle :isActive="vatEnabled" :onChange="toggleVatStatus" />
          <span class="text-[13px] font-medium font-satoshi"> VAT Enabled </span>
        </div>
        <div class="w-[65%]">
          <div class="gap-2">
            <div class="grid grid-cols-2 mt-3">
              <div class="me-3">
                <SelectInput
                  label="VAT Type"
                  important="*"
                  :onChange="(v) => setVatState('type', v)"
                  :selected="vatState?.type ?? ''"
                  value="value"
                  :name="['value']"
                  :items="lookUp['vatType']"
                ></SelectInput>
              </div>

              <div class="me-3">
                <TextInput
                  label="VAT Fee"
                  important="*"
                  placeholder="250000"
                  type="text"
                  :onChange="(v) => setVatState('fee', v)"
                  :value="`${data?.vat.fee ?? ''}`"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 mt-3">
              <div class="me-3">
                <SelectInput
                  label="Price Type"
                  :onChange="(v) => setItemState('currencyCode', v)"
                  :errorMessage="itemErrorMessage?.currencyCode"
                  :selected="itemState?.currencyCode ?? ''"
                  value="name"
                  :name="['value']"
                  :items="lookUp['currencies']"
                ></SelectInput>
              </div>

              <div>
                <TextInput
                  label="Stamp Duty Price ( optional )"
                  placeholder="Ex. 250000"
                  type="number"
                  :onChange="(v) => setStampState('fee', v)"
                  :value="stampState?.fee"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 mt-3">
              <div>
                <TextInput
                  label="Set Maximum Fee"
                  placeholder="Ex. 20000"
                  type="text"
                  important="*"
                  :onChange="(v) => setVatState('maximumFee', v)"
                  :value="`${vatState?.maximumFee ?? ''}`"
                />
              </div>
              <div class="flex justify-end">
                <div class="">
                  <ButtonInput
                    :loading="loadingItemDetails"
                    class="h-[46px] w-[174px] text-[13px] mt-9"
                    icon="keyboard_double_arrow_right"
                    :onClick="submitItemDetail"
                  >
                    Save Changes
                  </ButtonInput>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />

      <div class="flex w-full px-3 font-satoshi py-5">
        <div class="w-[45%]">
          <p class="text-sm font-medium not-italic pb-3">GIFMIS Information</p>
        </div>
        <div class="w-[65%]">
          <div class="gap-2">
            <div class="grid grid-cols">
              <div class="mt-3">
                <div class="bg-[#F3FEFD] rounded-lg flex justify-center items-center py-8">
                  <span class="font-satoshi text-sm font-medium text-[#42746F]"
                    >Document GIFMIS Item - {{ data?.gifmisCode }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center py-12 px-8 mx-8">
      <SpinnerComponent></SpinnerComponent>
    </div>
  </div>
</template>

<style>
.btn-bg {
  background-color: #cadfeb !important;
}
</style>
