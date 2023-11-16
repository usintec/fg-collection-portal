<script setup lang="ts">
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import SelectInput from '@/components/inputs/select/SelectInput.vue'
import TextInput from '../inputs/text/TextInput.vue'
import CheckBox from '../inputs/check/CheckBox.vue'
import SearchMda from './SearchMda.vue'
import CurrencyInput from '../inputs/text/CurrencyInput.vue'
import { onMounted, ref } from 'vue'
import type { IBank, ISearchOrgnisation, ITsa, ITsaSettings } from '@/services/types'
import LookUpService from '@/services/LookUpService'
import OrganizationService from '@/services/OrganizationService'
import MaterialIcon from '../icon/MaterialIcon.vue'
import { useToast } from 'vue-toastification'
import DeletePopup from './DeletePopup.vue'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

const banks = ref<IBank[]>()
const emit = defineEmits<{
  (e: 'remove', v: string): void
  (e: 'add'): void
}>()
const confirmDelete = ref(false)
const loadingDelete = ref(false)
const toast = useToast()
const props = defineProps<{
  item: Partial<ITsaSettings>
}>()
const savedSetting = ref<{ name: string; image: string }>()
const loading = ref(false)
const mdas = ref<ISearchOrgnisation[]>([])
const state = ref<Partial<ITsa>>({ applicableToAll: true, organizationIds: [] })
const validationFields: (keyof ITsa)[] = [
  'bankCode',
  'bankName',
  'currencyCode',
  'accountNumber',
  'accountName'
]
const errorMessage = ref<Partial<ITsa>>()
const setState = (key: keyof ITsa, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
const setErrorMessage = (key: keyof ITsa, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}
const errorMessages = (keys: (keyof ITsa)[]) => {
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
  if (!props.item.applicableToAll) {
    state.value.organizationIds = []
    mdas.value = []
    props.item.organizations?.forEach((org) => {
      state.value.organizationIds?.push(org.organizationId)
      mdas.value.push({
        code: org.organizationCode,
        name: org.organizationName,
        organizationId: org.organizationId,
        organizationEmail: ''
      })
    })
  }
  banks.value = await LookUpService.bank()
  savedSetting.value = {
    name: props.item.currencyCode ?? '',
    image: props.item.currencyCode
      ? `https://statics.fr-par-1.linodeobjects.com/currencies/${props.item.currencyCode.toLowerCase()}.svg`
      : ''
  }
})

const save = async () => {
  const bank = banks.value?.find(
    (bank) => bank.name.toLowerCase() == state.value.bankName?.toLowerCase()
  )
  state.value.bankCode = bank?.code
  if (errorMessages(validationFields)) return
  loading.value = true
  try {
    const res = await OrganizationService.createTsaSetting(state.value)
    loading.value = false
    state.value.id = res.settingId
    emit('add')
    toast.success('TSA settings saved successfully')
  } catch (error) {
    loading.value = false
  }
}

const toggleApplicableToAll = () => {
  state.value.applicableToAll = !state.value.applicableToAll
  mdas.value = []
  state.value.organizationIds = []
}

const addMda = (mda: ISearchOrgnisation) => {
  if (mdas.value.includes(mda)) return
  mdas.value.push(mda)
  state.value.organizationIds?.push(mda.organizationId)
  if (state.value.applicableToAll) state.value.applicableToAll = false
}
const removeMda = (index: number) => {
  mdas.value.splice(index, 1)
  state.value.organizationIds?.splice(index, 1)
  if (mdas.value.length <= 0) state.value.applicableToAll = true
}
const update = async () => {
  const bank = banks.value?.find(
    (bank) => bank.name.toLowerCase() == state.value.bankName?.toLowerCase()
  )
  state.value.bankCode = bank?.code
  if (errorMessages(validationFields)) return
  loading.value = true
  try {
    state.value.settingId = state.value.id
    const res = await OrganizationService.updateTsaSetting(state.value)
    loading.value = false
    state.value.id = res.settingId
    toast.success('TSA settings updated successfully')
  } catch (error) {
    loading.value = false
  }
}

const deleteSetting = async () => {
  confirmDelete.value = false
  loadingDelete.value = true
  try {
    await OrganizationService.deleteTsaSettings(state.value.id ?? '')
    loadingDelete.value = false
    emit('remove', state.value?.id ?? '')
    toast.success('TSA Setting Deleted successfully')
  } catch (error) {
    loadingDelete.value = false
  }
}

const closeDelete = () => {
  confirmDelete.value = false
}
</script>
<template>
  <div class="border rounded-md w-full p-7 mb-4">
    <div class="flex flex-col xl:flex-row">
      <div class="flex-col xl:w-1/2">
        <div class="pl-3">
          <CurrencyInput
            label="Currency"
            :onChange="(v) => setState('currencyCode', v)"
            :selectItem="(v) => setState('currencyCode', v)"
            placeholder="Naira (NGN)"
            type="text"
            class="w-74"
            readonly
            :errorMessage="errorMessage?.currencyCode"
            :value="state.currencyCode"
            :item="savedSetting"
          />
        </div>
        <div class="pl-3 pt-6">
          <TextInput
            label="Account Number"
            :onChange="(v) => setState('accountNumber', v)"
            placeholder="Type here"
            type="text"
            :errorMessage="errorMessage?.accountNumber"
            :value="state.accountNumber"
            class="w-74"
          />
        </div>
      </div>
      <div class="flex-col pl-3 xl:w-1/2">
        <div class="">
          <SelectInput
            label="Select a bank"
            :onChange="(v) => setState('bankName', v)"
            value="name"
            :name="['name']"
            :items="banks ?? []"
            :selected="state?.bankName"
            :errorMessage="errorMessage?.bankName"
            class="w-74 text"
          />
        </div>
        <div class="pt-6">
          <TextInput
            label="Account Name"
            :onChange="(v) => setState('accountName', v)"
            placeholder="Type here"
            type="text"
            :value="state?.accountName"
            :errorMessage="errorMessage?.accountName"
            class="w-74"
          />
        </div>
      </div>
      <div class="flex-col w-full sm:pt-2 xl:pl-10">
        <div class="flex justify-between">
          <p class="text-dark_green text-md sm:p-3">Search and Select MDAs</p>
          <div class="flex items-center text-dark_green pt-1">
            <CheckBox
              :activeGreen="state.applicableToAll"
              :checked="state?.applicableToAll"
              @onChecked="toggleApplicableToAll"
            />
            <span class="pl-1">Select All MDAs</span>
          </div>
        </div>
        <div class="flex-col w-full">
          <SearchMda @onRowClick="addMda" :class="{ 'w-full': true }"></SearchMda>
          <div class="flex-col overflow-scroll h-40">
            <div
              class="flex justify-between bg-[#ECF7FF] mt-2 p-3"
              v-for="(organisation, index) in mdas"
              :key="index"
            >
              <p class="text-[#4D7898] text-md font-bold">{{ organisation.name }}</p>
              <MaterialIcon
                @click="() => removeMda(index)"
                icon="close"
                class="text-[#959DB8] text-2xl hover:text-dark_green cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end pl-3 pt-2">
      <div class="flex justify-end gap-3">
        <CheckPermission :permission="Permissions.DeleteTsaSettings">
          <ButtonInput
            v-if="state.id"
            bg="bg-[#D8E8F2]"
            class="!w-[122px] !text-dark_green"
            :onClick="() => (confirmDelete = true)"
            @click="() => (confirmDelete = true)"
            :loading="loadingDelete"
            >Remove
          </ButtonInput>
        </CheckPermission>
        <!-- emit('remove', state.id ?? '' -->
        <DeletePopup
          @delete="deleteSetting"
          title="Delete TSA Setting"
          :show="confirmDelete"
          @closeModal="closeDelete"
        ></DeletePopup>
        <ButtonInput
          v-if="!state.id"
          bg="bg-[#47C271]"
          class="!w-[122px] !text-white"
          :onClick="save"
          :loading="loading"
          >Save Account
        </ButtonInput>
        <ButtonInput
          v-else
          bg="bg-[#47C271]"
          class="!w-[122px] !text-white"
          :onClick="update"
          :loading="loading"
          >Update
        </ButtonInput>
      </div>
    </div>
  </div>
</template>
