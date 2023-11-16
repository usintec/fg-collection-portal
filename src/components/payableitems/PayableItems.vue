<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Breadcrumb from '../breadcrumb/Breadcrumb.vue'
import { useRouter } from 'vue-router'
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import FormComplete from '../ui-elements/FormComplete.vue'
import Stepper from '../stepper/Stepper.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import Toggle from '../inputs/toggle/Toggle.vue'
import SearchInputVue from '../inputs/search/SearchInput.vue'
import CurrencyInput from '../inputs/text/CurrencyInput.vue'
import type {
  PayableItemModel,
  StampDuty,
  Vat,
  addition,
  PriceRange,
  INameValue,
  IPayableItem
} from '@/services/types'
import PayableItemService from '@/services/PayableService'
import { useToast } from 'vue-toastification'
import { ref, onMounted, watch } from 'vue'
import CheckBox from '../inputs/check/CheckBox.vue'
import LookUpService from '@/services/LookUpService'
import { usePageNameStore } from '@/stores/pageName'
import SpinnerComponent from '../loader/SpinnerComponent.vue'
import { useOrganizationStore } from '@/stores/organizationStore'
import DynamicForm from '../dynamic-form/DynamicForm.vue'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

const toast = useToast()

const router = useRouter()
const step = ref(0)
const loading = ref(false)
const isActive = ref(false)
const isChecked = ref(false)
const menuStore = usePageNameStore()

watch(
  () => menuStore._goBack,
  () => {
    router.back()
    menuStore.setPageName('Payable Items')
  }
)

const steps = ['GIFMIS Information', 'Item Details', 'VAT & Stamp Duty', 'Additional Information']

const itemState = ref<PayableItemModel>({} as PayableItemModel)
const itemErrorMessage = ref<Partial<PayableItemModel>>()
const gifCodeLookUp = ref(false)

const lookUp = ref<Record<string, INameValue[]>>({})
const lookUpLoader = ref(false)

const stampState = ref<StampDuty>({} as StampDuty)
const stampErrorMessage = ref<Partial<StampDuty>>()

const priceRange = ref<PriceRange>({} as PriceRange)
const priceErrorMessage = ref<Partial<PriceRange>>()

const vatState = ref<Vat>({} as Vat)
const vatErrorMessage = ref<Partial<Vat>>()

const addState = ref<addition>({} as addition)
const addErrorMessage = ref<Partial<addition>>()

const submitData = ref(false)

const orgStore = useOrganizationStore()

onMounted(async () => {
  const currencies = await LookUpService.currencies()
  const vatType = await LookUpService.vatTypes()

  lookUp.value = {
    currencies,
    vatType
  }
  lookUpLoader.value = false
})

const setItemState = (
  key: keyof PayableItemModel,
  value: string | boolean | Record<string, any>
) => {
  itemState.value = { ...itemState.value, [key]: value }
  itemErrorMessage.value = { ...itemErrorMessage.value, [key]: undefined }
}

const setStampState = (key: keyof StampDuty, value: string) => {
  stampState.value = { ...stampState.value, [key]: value }
  stampErrorMessage.value = { ...stampErrorMessage.value, [key]: undefined }
}

const setVatState = (key: keyof Vat, value: string) => {
  if (key !== 'type') {
    vatState.value = { ...vatState.value, [key]: Number(value) }
  } else vatState.value = { ...vatState.value, [key]: value }
  vatErrorMessage.value = { ...vatErrorMessage.value, [key]: undefined }
}

const setItemErrorMessage = (key: keyof PayableItemModel, message: string) => {
  itemErrorMessage.value = { ...itemErrorMessage.value, [key]: message }
}

const setPriceRange = (key: keyof PriceRange, v: string) => {
  priceRange.value = { ...priceRange.value, [key]: v }
  setPriceError(key, undefined)
}

const setPriceError = (key: keyof PriceRange, v?: string) => {
  priceErrorMessage.value = { ...priceErrorMessage.value, [key]: v }
}

const onCheck = () => {
  isChecked.value = !isChecked.value
  setItemState('isPayable', isChecked.value)
}

const firstStepKeys: (keyof PayableItemModel)[] = ['gifmisCode']

const secondStepKeys: (keyof PayableItemModel)[] = ['name', 'code', 'currencyCode']

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

const rangeErrorMessages = () => {
  let error = false
  const keys: (keyof PriceRange)[] = ['min', 'max']
  for (const key of keys) {
    if (!priceRange.value[key]) {
      setPriceError(key, `${key} is required`)
      error = true
    }
  }
  return error
}

const secondStep = () => {
  const error = itemErrorMessages(secondStepKeys)
  if (isActive.value) {
    return itemErrorMessages(['price']) || error
  } else {
    return rangeErrorMessages() || error
  }
}

const onChange = (v: string) => {
  searchQuery.value = v
  setItemState('gifmisCode', v)
}

const cancel = () => {
  router.push('/payable-items')
}

const createNew = () => {
  itemState.value = {} as PayableItemModel
  stampState.value = {} as StampDuty
  vatState.value = {} as Vat
  addState.value = {} as addition
  priceRange.value = {} as PriceRange
  itemErrorMessage.value = {}
  stampErrorMessage.value = {}
  vatErrorMessage.value = {}
  addErrorMessage.value = {}
  isActive.value = false
  step.value = 0
}

const toggle = () => {
  isActive.value = !isActive.value
}

const back = () => {
  step.value -= 1
}

const next = () => {
  if (gifCodeLookUp.value) return
  if (step.value === 0) {
    if (itemErrorMessages(firstStepKeys)) {
      return
    } else {
      step.value += 1
    }
  } else if (step.value === 1) {
    if (secondStep()) {
      return
    } else {
      step.value += 1
    }
  } else if (step.value === 2) {
    step.value += 1
  } else if (step.value === 3) {
    return submit()
  }
}

const submit = async () => {
  loading.value = true
  const state: Partial<IPayableItem> = {}

  itemState.value.stampDuty = stampState.value
  itemState.value.vat = vatState.value
  if (!isActive.value) {
    itemState.value.priceRange = priceRange.value
    delete itemState.value.price
  }
  state.organizationId = orgStore.fg_id
  state.payableItemModels = [itemState.value]

  try {
    await PayableItemService.create(state)
    toast.success('Created successfully')
    step.value += 1
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

const searchQuery = ref('')

const filteredGifmisCode = ref<string | null>(null)

watch(
  () => searchQuery.value,
  async () => {
    if (!searchQuery.value) {
      filteredGifmisCode.value = null
    }
    gifCodeLookUp.value = true
    const query = searchQuery.value.toString().toLowerCase()
    const res = await PayableItemService.searchCode(query)
    filteredGifmisCode.value = res.name
    gifCodeLookUp.value = false
  }
)
</script>

<template>
  <div class="pb-10">
    <div class="h-[68px] flex px-8 py-12 items-center justify-between">
      <Breadcrumb title="Create a new Payable Item" name="Add new payable item" />
      <div class="flex gap-4 justify-center items-center">
        <ButtonInput class="text-xs font-bold w-40 h-11 bg-color" :onClick="cancel">
          Cancel
        </ButtonInput>
      </div>
    </div>

    <div class="bg-white rounded-3xl py-12 px-8 mx-8 flex">
      <div class="hidden lg:flex w-2/5">
        <Stepper :steps="steps" :currentStep="step" />
      </div>

      <div class="w-80 lg:w-[59%]">
        <div v-if="step === 0">
          <div class="grid grid-cols">
            <div>
              <SearchInputVue
                label="Payable Item GIFMIS Code"
                placeholder="Enter your search here"
                :errorMessage="itemErrorMessage?.gifmisCode"
                :onChange="(v) => onChange(v)"
                :value="searchQuery"
              />
            </div>

            <div class="mt-3 relative">
              <label class="font-satoshi text-dark_green text-sm font-medium">Item Name</label>

              <div v-if="filteredGifmisCode">
                <div class="bg-[#F3FEFD] rounded-lg flex justify-center items-center py-8">
                  <span>{{ filteredGifmisCode }}</span>
                </div>
              </div>

              <div
                class="bg-[#F3FEFD] rounded-lg flex justify-center items-center py-8"
                v-else-if="searchQuery && !filteredGifmisCode"
              >
                <span class="font-satoshi text-sm font-medium"> No result found </span>
              </div>
              <div class="bg-[#F3FEFD] rounded-lg flex justify-center items-center py-8" v-else>
                <span class="font-satoshi text-sm font-medium"> Item name will display here </span>
              </div>
              <div v-if="gifCodeLookUp" class="absolute right-0 top-8">
                <SpinnerComponent />
              </div>
            </div>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <CheckPermission :permission="Permissions.ActivatePayableItem">
              <div
                :class="{
                  'text-green-500': isChecked,
                  'text-dark_green': !isChecked
                }"
                class="pt-3 flex gap-4 items-center"
              >
                <CheckBox :checked="isChecked" @onChecked="onCheck" :activeGreen="isChecked" />
                <span class="text-sm font-medium"> Activate item for customer portal </span>
              </div>
            </CheckPermission>
            <div class="w-32">
              <ButtonInput
                :loading="loading"
                class="h-[46px] w-[133px] text-[13px]"
                icon="keyboard_double_arrow_right"
                :onClick="next"
              >
                Continue
              </ButtonInput>
            </div>
          </div>
        </div>

        <div v-if="step === 1">
          <div class="grid grid-cols-2">
            <div class="me-3">
              <TextInput
                label="Item Name"
                placeholder="Type here"
                type="text"
                :onChange="(v) => setItemState('name', v)"
                important="*"
                :errorMessage="itemErrorMessage?.name"
                :value="itemState?.name"
              />
            </div>

            <div>
              <TextInput
                label="Item Code"
                placeholder="Type here"
                type="text"
                :onChange="(v) => setItemState('code', v)"
                important="*"
                :errorMessage="itemErrorMessage?.code"
                :value="itemState?.code"
              />
            </div>
          </div>

          <div>
            <div class="grid grid-cols pt-3">
              <p class="text-dark_green text-sm font-medium font-satoshi">
                Price and Currency <span class="text-red-600">*</span>
              </p>
            </div>

            <div
              class="flex-col gap-2 md:flex-col lg:flex-row lg:h-[56px] rounded-lg bg-[#F6F8FF] flex justify-between items-center px-5"
            >
              <div class="pe-4">
                <Toggle :isActive="isActive" :onChange="toggle" />
                <span class="text-[13px] font-medium font-satoshi">
                  {{ isActive ? 'Fixed Price' : 'Range' }}
                </span>
              </div>

              <TextInput
                label=""
                v-if="isActive"
                placeholder="Ex. 200,000"
                class="h-[46px] w-2/3 rounded-[7px] px-5"
                type="number"
                whiteBackground
                :errorMessage="itemErrorMessage?.price"
                :onChange="(v) => setItemState('price', v)"
                :value="itemState?.price"
              />
              <div v-else class="h-[46px] w-2/3 flex gap-4 px-5">
                <TextInput
                  label=""
                  placeholder="Min Price"
                  class="h-[46px] w-1/2 rounded-[7px] px-5"
                  type="number"
                  whiteBackground
                  :errorMessage="priceErrorMessage?.min"
                  :onChange="(v) => setPriceRange('min', v)"
                  :value="priceRange?.min"
                />
                <TextInput
                  label=""
                  placeholder="Max Price"
                  class="h-[46px] w-1/2 rounded-[7px] px-5"
                  type="number"
                  whiteBackground
                  :errorMessage="priceErrorMessage?.max"
                  :onChange="(v) => setPriceRange('max', v)"
                  :value="priceRange?.max"
                />
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
                  :value="itemState?.currencyCode"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols mt-3">
            <TextInput
              label="Describe Item"
              placeholder="Type here"
              type="text"
              :onChange="(v) => setItemState('description', v)"
              :value="itemState?.description"
              :errorMessage="itemErrorMessage?.description"
            />
          </div>

          <div class="grid grid-cols mt-20">
            <div class="flex justify-between">
              <div class="pt-3 flex hover:cursor-pointer" @click="back">
                <span
                  class="bg-[#CADFEB] rounded-full w-7 h-7 flex justify-center items-center me-2"
                >
                  <MaterialIcon
                    outline
                    icon="chevron_left"
                    class="text-black rounded-full bg-green"
                  />
                </span>
                <span class="text-sm font-medium pt-1"> Go Back </span>
              </div>
              <div class="w-32">
                <ButtonInput
                  :loading="loading"
                  class="h-[46px] w-[133px] text-[13px]"
                  icon="keyboard_double_arrow_right"
                  @click="next"
                >
                  Continue
                </ButtonInput>
              </div>
            </div>
          </div>
        </div>

        <div v-if="step === 2">
          <div class="grid grid-cols pb-5">
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
          <hr />

          <div class="grid grid-cols pt-3">
            <p class="text-sm font-normal font-satoshi text-[#6A789A]">
              VAT price setup ( optional )
            </p>
          </div>
          <div class="grid grid-cols-2 mt-3">
            <div class="me-3">
              <SelectInput
                label="VAT Type"
                :onChange="(v) => setVatState('type', v)"
                :selected="vatState?.type"
                :errorMessage="vatErrorMessage?.type"
                value="name"
                :name="['value']"
                :items="lookUp['vatType']"
              ></SelectInput>
            </div>

            <div>
              <TextInput
                label="VAT Fee"
                placeholder="Ex. 20%"
                type="text"
                :onChange="(v) => setVatState('fee', v)"
                :value="`${vatState?.fee ?? ''}`"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 mt-3">
            <div>
              <TextInput
                v-if="vatState.type === 'percentage'"
                label="Set Cap Fee"
                placeholder="Ex. 20000"
                type="text"
                :onChange="(v) => setVatState('maximumFee', v)"
                :value="`${vatState?.maximumFee ?? ''}`"
              />
            </div>
          </div>

          <div class="grid grid-cols">
            <div class="mt-5 flex justify-between">
              <div class="pt-3 flex hover:cursor-pointer" @click="back">
                <span
                  class="bg-[#CADFEB] rounded-full w-7 h-7 flex justify-center items-center me-2"
                >
                  <MaterialIcon
                    outline
                    icon="chevron_left"
                    class="text-black rounded-full bg-green"
                  />
                </span>
                <span class="text-sm font-medium pt-1"> Go Back </span>
              </div>
              <div class="w-32">
                <ButtonInput
                  :loading="loading"
                  class="h-[46px] w-[133px] text-[13px]"
                  icon="keyboard_double_arrow_right"
                  :onClick="next"
                >
                  Continue
                </ButtonInput>
              </div>
            </div>
          </div>
        </div>
        <div v-if="step === 3" class="flex flex-col">
          <DynamicForm
            title="Payable Item Additional Information"
            width="w-[90%]"
            :submitData="submitData"
            @submit="
              (v) => {
                setItemState('additionalInformation', v)
                next()
              }
            "
          />
          <div class="mt-5 flex justify-between">
            <div class="pt-3 flex hover:cursor-pointer" @click="back">
              <span class="bg-[#CADFEB] rounded-full w-7 h-7 flex justify-center items-center me-2">
                <MaterialIcon
                  outline
                  icon="chevron_left"
                  class="text-black rounded-full bg-green"
                />
              </span>
              <span class="text-sm font-medium pt-1"> Go Back </span>
            </div>
            <div class="w-32">
              <ButtonInput
                :loading="loading"
                class="h-[46px] w-[133px] text-[13px]"
                icon="keyboard_double_arrow_right"
                :onClick="
                  () => {
                    submitData = !submitData
                  }
                "
              >
                Continue
              </ButtonInput>
            </div>
          </div>
        </div>

        <div v-if="step === 4">
          <FormComplete
            successText="Created Successfully"
            text="A new Payable item has be created and saved. You can modify item details when you view the item."
          >
            <div class="w-full flex gap-4 text-[13px] text-thin">
              <div class="flex justify-center w-2/3">
                <ButtonInput type="button" class="mt-9" :onClick="createNew" id="closeButton">
                  Create new
                </ButtonInput>
              </div>
              <div class="flex justify-center w-2/3">
                <ButtonInput type="button" class="mt-9" :onClick="cancel" id="closeButton">
                  Continue
                </ButtonInput>
              </div>
            </div>
          </FormComplete>
        </div>
      </div>
    </div>
  </div>
</template>
