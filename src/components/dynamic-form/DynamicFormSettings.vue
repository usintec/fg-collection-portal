<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import SelectInputVue from '@/components/inputs/select/SelectInput.vue'
import type { InputElement } from './types'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import CurrencyInput from '../inputs/text/CurrencyInput.vue'
import type { IBillingCycle, IBillingSettings } from '@/services/types'
import { onMounted, ref } from 'vue'
import OrganizationService from '@/services/OrganizationService'
import { useToast } from 'vue-toastification'
import DeletePopup from '../organizations/DeletePopup.vue'
import SpinnerComponent from '../loader/SpinnerComponent.vue'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

interface IFrequency {
  item: number
}
const confirmDelete = ref(false)
const props = defineProps<{
  item: Partial<IBillingSettings>
}>()
const savedSetting = ref<{ name: string; image: string }>()
const toast = useToast()
const billingCycle = ref<IBillingCycle[]>()
const frequency = ref<IFrequency[]>([])
const emit = defineEmits<{
  (e: 'change', v: Partial<InputElement>): void
  (e: 'remove', settingId: string): void
  (e: 'add'): void
}>()
const loading = ref(false)
const loadingDelete = ref(false)
const state = ref<Partial<IBillingSettings>>({})
const validationFields: (keyof IBillingSettings)[] = [
  'billingRate',
  'currencyCode',
  'billingFrequncy',
  'billingCycle'
]
const errorMessage = ref<Partial<IBillingSettings>>()
const setState = (key: keyof IBillingSettings, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
const setErrorMessage = (key: keyof IBillingSettings, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}
const errorMessages = (keys: (keyof IBillingSettings)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}

onMounted(async () => {
  state.value = props.item
  billingCycle.value = await OrganizationService.billingLookup()
  billingCycle.value
    ?.find((c) => c.name == state.value.billingCycle)
    ?.frequencies.forEach((value) => frequency.value.push({ item: value }))
  savedSetting.value = {
    name: props.item.currencyCode ?? '',
    image: props.item.currencyCode
      ? `https://statics.fr-par-1.linodeobjects.com/currencies/${props.item.currencyCode.toLowerCase()}.svg`
      : ''
  }
})

const save = async () => {
  if (errorMessages(validationFields)) return
  loading.value = true
  try {
    const res = await OrganizationService.createBillingSetting(state.value)
    state.value.id = res.settingId
    loading.value = false
    emit('add')
    toast.success('Bill Setting saved successfully')
  } catch (error) {
    loading.value = false
  }
}

const update = async () => {
  if (errorMessages(validationFields)) return
  loading.value = true
  try {
    state.value.billingSettingId = state.value.id
    const res = await OrganizationService.updateBillingSetting(state.value)
    state.value.id = res.settingId
    loading.value = false
    toast.success('Bill Setting updated successfully')
  } catch (error) {
    loading.value = false
  }
}

const deleteSetting = async () => {
  confirmDelete.value = false
  loadingDelete.value = true
  try {
    await OrganizationService.deleteBillSetting(state.value.id ?? '')
    loadingDelete.value = false
    emit('remove', state.value?.id ?? '')
    toast.success('Bill Setting Deleted successfully')
  } catch (error) {
    loadingDelete.value = false
  }
}

const closeDelete = () => {
  confirmDelete.value = false
}
</script>
<template>
  <div class="flex flex-col w-full">
    <div class="text-sm text-dark_green h-16 flex gap-4 rounded-md justify-between items-center">
      <div class="flex gap-4 flex-1 flex-3 h-11">
        <CurrencyInput
          label=""
          :onChange="(v) => setState('currencyCode', v)"
          :selectItem="(v) => setState('currencyCode', v)"
          placeholder="Naira (NGN)"
          type="text"
          class="w-1/3 h-11"
          readonly
          :errorMessage="errorMessage?.currencyCode"
          :value="state.currencyCode"
          :item="savedSetting"
        />
        <SelectInputVue
          label=""
          :onChange="
            (v) => {
              setState('billingCycle', v)
              frequency = []
              const item = billingCycle?.find((c) => c.value == v)
              const fields = ['Yearly', 'BiWeekly', 'OneOff', 'Quarterly', 'HalfYearly']
              if (item?.name && fields.includes(item?.value.trim()))
                frequency.push({ item: item?.defaultFrequncy })
              else item?.frequencies.forEach((value) => frequency.push({ item: value }))
              state.billingFrequncy = item?.defaultFrequncy
            }
          "
          class="w-1/3 text"
          :items="billingCycle ?? []"
          :name="['name']"
          noPadding
          value="value"
          :selected="state?.billingCycle?.toString()"
          :errorMessage="errorMessage?.billingCycle?.toString()"
        />
        <SelectInputVue
          label=""
          :onChange="(v) => setState('billingFrequncy', v)"
          class="w-1/3 text"
          :items="frequency ?? []"
          :name="['item']"
          noPadding
          value="item"
          :selected="state?.billingFrequncy?.toString()"
          :errorMessage="errorMessage?.billingFrequncy?.toString()"
        />
        <TextInput
          placeholder="200,000"
          label=""
          :onChange="(v) => setState('billingRate', v)"
          class="w-1/3"
          :value="state?.billingRate?.toString()"
          :errorMessage="errorMessage?.billingRate?.toString()"
        />
      </div>
      <div class="w-20" v-if="!state.id">
        <ButtonInput
          class="text-sm !text-[#204458] h-11"
          :onClick="save"
          :bg="'bg-[#DEEFFA]'"
          :loading="loading"
        >
          Save
        </ButtonInput>
      </div>
      <CheckPermission :permission="Permissions.UpdateBillingSettings" v-else>
        <div class="w-20">
          <ButtonInput
            class="text-sm !text-[#204458] h-11"
            :onClick="update"
            :bg="'bg-[#DEEFFA]'"
            :loading="loading"
          >
            Update
          </ButtonInput>
        </div>
      </CheckPermission>

      <CheckPermission :permission="Permissions.DeleteBillingSettings">
        <div
          v-if="state.id"
          @click="() => (confirmDelete = true)"
          class="flex justify-center items-center text-[#204458] cursor-pointer hover:scale-105"
        >
          <MaterialIcon icon="delete" class="text-lg" v-if="!loadingDelete" />
          <SpinnerComponent v-else></SpinnerComponent>
        </div>
      </CheckPermission>
      <DeletePopup
        @delete="deleteSetting"
        title="Delete Bill Setting"
        :show="confirmDelete"
        @closeModal="closeDelete"
      ></DeletePopup>
    </div>
  </div>
</template>
