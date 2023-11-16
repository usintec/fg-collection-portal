<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { onMounted, ref } from 'vue'
import SettlementForm from './SettlementForm.vue'
import PaymentService from '@/services/PaymentService'
import type { IProvider, ISetting, IConfigurationEntry } from '@/services/types'
import { useToast } from 'vue-toastification'
import TextInput from '../inputs/text/TextInput.vue'
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import CheckBox from '../inputs/check/CheckBox.vue'
import SpinnerComponent from '../loader/SpinnerComponent.vue'
import DeletePopup from '../organizations/DeletePopup.vue'

interface Iconfig {
  save: boolean
  delete: boolean
}
enum DeleteTask {
  PROVIDER = 'provider',
  CONFIGURATION = 'configuration'
}
const addNewProvider = ref(false)
const loading = ref<{ provider: boolean; config: Iconfig[] }[]>([])
const loadingPaymentGateways = ref(true)
const loadingDelete = ref<boolean[]>([])
const confirmDelete = ref(false)
const providerToDelete = ref<IProvider>()
const loadingAddProvider = ref(false)
const deleteTask = ref<DeleteTask>()
const configItemToDelete = ref<{ providerIndex: number; settingIndex: number }>()
const toast = useToast()
const state = ref<ISetting[]>([])
const validationFields: (keyof IConfigurationEntry)[] = ['key', 'value']
const errorMessage = ref<ISetting[]>([])
const setState = (
  providerIndex: number,
  settingIndex: number,
  key: keyof IConfigurationEntry,
  value: string
) => {
  state.value[providerIndex].configurationEntries[settingIndex] = {
    ...state.value[providerIndex].configurationEntries[settingIndex],
    [key]: value
  }
  errorMessage.value[providerIndex].configurationEntries[settingIndex] = {
    ...errorMessage.value[providerIndex]?.configurationEntries[settingIndex],
    [key]: undefined
  }
}
const setErrorMessage = (
  providerIndex: number,
  settingIndex: number,
  key: keyof IConfigurationEntry,
  message: string
) => {
  if (errorMessage.value)
    errorMessage.value[providerIndex].configurationEntries[settingIndex] = {
      ...errorMessage.value[providerIndex]?.configurationEntries[settingIndex],
      [key]: message
    }
}
const errorMessages = (
  providerIndex: number,
  settingIndex: number,
  keys: (keyof IConfigurationEntry)[]
) => {
  let error = false
  for (const key of keys) {
    if (!state.value[providerIndex].configurationEntries[settingIndex][key]) {
      setErrorMessage(providerIndex, settingIndex, key, `${key} is required`)
      error = true
    }
  }
  return error
}
const closeDelete = () => {
  confirmDelete.value = false
}
onMounted(async () => {
  try {
    const res = await PaymentService.getGatewaySettings()
    state.value.push(...res)
    res.forEach((provider) => {
      let config: Iconfig[] = []
      if (provider.configurationEntries.length <= 0)
        errorMessage.value.push({
          provider: provider.provider ?? '',
          configurationEntries: [
            {
              isSecret: false,
              key: '',
              value: ''
            }
          ]
        })
      else
        provider.configurationEntries.forEach(() => {
          if (errorMessage.value.filter((value) => value.provider == provider.provider).length < 1)
            errorMessage.value.push({
              provider: provider.provider ?? '',
              configurationEntries: [
                {
                  isSecret: false,
                  key: '',
                  value: ''
                }
              ]
            })
          else {
            const index = errorMessage.value.findIndex(
              (value) => value.provider == provider.provider
            )
            if (index >= 0) {
              errorMessage.value[index].configurationEntries.push({
                isSecret: false,
                key: '',
                value: ''
              })
            }
          }
          config.push({ save: false, delete: false })
        })
      loading.value.push({ provider: false, config: config })
      loadingDelete.value.push(false)
    })
    loadingPaymentGateways.value = false
  } catch (err) {
    loadingPaymentGateways.value = false
  }
})
const save = async (providerIndex: number, configIndex: number) => {
  let err = false
  state.value[providerIndex]?.configurationEntries.forEach((item, i) => {
    if (errorMessages(providerIndex, i, validationFields)) err = true
    state.value[providerIndex].configurationEntries[i].key = item.key.replace(/\s/g, '') ?? item.key
  })
  if (err) return
  loading.value[providerIndex].provider = true
  loading.value[providerIndex].config[configIndex].save = true
  try {
    if (state.value[providerIndex].settingId)
      await PaymentService.updateGatewaytSetting(state.value[providerIndex])
    state.value[providerIndex].configurationEntries.forEach((value) => (value.isNew = false))
    loading.value[providerIndex].provider = false
    loading.value[providerIndex].config[configIndex].save = false
    toast.success('Provider Setting saved successfully')
  } catch (error) {
    loading.value[providerIndex].provider = false
    loading.value[providerIndex].config[configIndex].save = false
  }
}
const close = () => (addNewProvider.value = false)
const check = (providerIndex: number, settingIndex: number) => {
  state.value[providerIndex].configurationEntries[settingIndex].isSecret =
    !state.value[providerIndex].configurationEntries[settingIndex].isSecret
}
const addProvider = async (v: string) => {
  try {
    loadingAddProvider.value = true
    const res = await PaymentService.createGatewaySetting({
      provider: v,
      configurationEntries: []
    })
    loadingAddProvider.value = false
    state.value.push({
      provider: v,
      settingId: res.settingId,
      configurationEntries: [
        {
          isSecret: false,
          key: '',
          value: '',
          isNew: true
        }
      ]
    })
    errorMessage.value.push({
      provider: v,
      configurationEntries: [
        {
          isSecret: false,
          key: '',
          value: ''
        }
      ]
    })
    loading.value.push({ provider: false, config: [{ save: false, delete: false }] })
    loadingDelete.value.push(false)
    addNewProvider.value = false
  } catch (err) {
    loadingDelete.value.push(false)
    addNewProvider.value = false
  }
}
const removeAt = async () => {
  try {
    confirmDelete.value = false
    if (deleteTask.value == DeleteTask.PROVIDER) {
      if (providerToDelete.value) {
        confirmDelete.value = false
        loadingDelete.value[providerToDelete.value?.index] = true
        await PaymentService.deleteGatewaySetting(providerToDelete.value?.providerId)
        state.value.splice(providerToDelete.value?.index, 1)
        loadingDelete.value[providerToDelete.value?.index] = false
        toast.success('Provider Setting deleted successfully')
      }
    } else if (deleteTask.value == DeleteTask.CONFIGURATION) await removeConfigurationSetting()
  } catch (err) {
    if (providerToDelete.value) loadingDelete.value[providerToDelete.value?.index] = false
  }
}
const setProviderToDelete = (provider: IProvider) => {
  if (!provider.providerId) {
    toast.error('This provider has not created.')
    return
  }
  providerToDelete.value = provider
  deleteTask.value = DeleteTask.PROVIDER
  confirmDelete.value = true
}
const setConfigurationToDelete = (providerIndex: number, settingIndex: number) => {
  configItemToDelete.value = { providerIndex, settingIndex }
  deleteTask.value = DeleteTask.CONFIGURATION
  confirmDelete.value = true
}
// const removeConfigurationSetting = (poviderIndex: number, settingIndex: number) =>
//   state.value[poviderIndex].configurationEntries.splice(settingIndex, 1)
const removeConfigurationSetting = async () => {
  if (configItemToDelete.value)
    try {
      if (state.value[configItemToDelete.value?.providerIndex].settingId) {
        loading.value[configItemToDelete.value?.providerIndex].provider = true
        loading.value[configItemToDelete.value?.providerIndex].config[
          configItemToDelete.value.settingIndex
        ].delete = true
        await PaymentService.updateGatewaytSetting({
          provider: state.value[configItemToDelete.value?.providerIndex].provider,
          configurationEntries: state.value[
            configItemToDelete.value?.providerIndex
          ].configurationEntries.slice(0, configItemToDelete.value.settingIndex),
          settingId: state.value[configItemToDelete.value?.providerIndex].settingId
        })
        loading.value[configItemToDelete.value?.providerIndex].provider = false
        loading.value[configItemToDelete.value?.providerIndex].config[
          configItemToDelete.value.settingIndex
        ].delete = false
        state.value[configItemToDelete.value?.providerIndex].configurationEntries.splice(
          configItemToDelete.value.settingIndex,
          1
        )
        toast.success('Configuration item deleted successfully')
      }
    } catch (error) {
      loading.value[configItemToDelete.value?.providerIndex].provider = false
      loading.value[configItemToDelete.value?.providerIndex].config[
        configItemToDelete.value.settingIndex
      ].delete = false
    }
}
const addNewProviderSetting = async (providerIndex: number) => {
  state.value[providerIndex].configurationEntries.push({
    isSecret: false,
    key: '',
    value: '',
    isNew: true
  })
  errorMessage.value[providerIndex].configurationEntries.push({
    isSecret: false,
    key: '',
    value: ''
  })
  loading.value[providerIndex]?.config.push({ save: false, delete: false })
}
</script>

<template>
  <div>
    <div v-if="!loadingPaymentGateways">
      <div class="px-4 flex justify-between items-center">
        <div>
          <h3 class="text-sm font-medium">Payment gateways configuration</h3>
          <p class="text-[#8492B6] text-xs font-normal pt-5">
            Configure your payment gateways and supply values for keys and setup
          </p>
        </div>

        <div class="w-[13%]">
          <ButtonInput
            class="text-sm !text-[#fff] h-11"
            :onClick="() => (addNewProvider = true)"
            :bg="'bg-[#204458]'"
          >
            Add Provider
          </ButtonInput>
        </div>
      </div>

      <div class="my-7 w-full" v-for="(_, index) in state" :key="index">
        <div class="mx-3 my-5 rounded-lg border py-2 px-4">
          <div class="flex flex-col w-full">
            <div class="flex justify-between items-center my-3">
              <div>
                <span class="bg-[#F0F8FF] p-2 rounded-md px-4 text-md text-[#4E9DE7] me-3"
                  >Provider Name: <strong>{{ state[index]?.provider }}</strong></span
                >
              </div>
              <div class="w-1/2 xl:w-2/5 2xl:w-1/3 flex gap-5">
                <ButtonInput
                  class="text-sm !text-[#fff] h-11"
                  :bg="'bg-[#FF144D]'"
                  :onClick="
                    () => setProviderToDelete({ providerId: state[index]?.settingId ?? '', index })
                  "
                  :loading="loadingDelete[index]"
                >
                  Remove Provider
                </ButtonInput>
                <ButtonInput
                  class="text-sm !text-[#204458] h-11"
                  :onClick="() => addNewProviderSetting(index)"
                  :bg="'bg-[#DEEFFA]'"
                >
                  Add Key
                </ButtonInput>
                <DeletePopup
                  @delete="() => removeAt()"
                  title="Delete Payment Gateway Configuration"
                  :show="confirmDelete"
                  @closeModal="closeDelete"
                ></DeletePopup>
              </div>
            </div>
            <div
              class="text-sm text-dark_green h-28 flex gap-4 justify-between items-center px-1 border-b"
              v-for="(item, ind) in state[index]?.configurationEntries"
              :key="ind"
            >
              <TextInput
                :onChange="(v) => setState(index, ind, 'key', v)"
                :value="state[index]?.configurationEntries[ind]?.key"
                :errorMessage="errorMessage[index]?.configurationEntries[ind].key?.toString()"
                placeholder="Type here"
                label="Key"
                class="w-4/12 h-16"
              />
              <TextInput
                :onChange="(v) => setState(index, ind, 'value', v)"
                :value="state[index]?.configurationEntries[ind]?.value"
                :errorMessage="errorMessage[index]?.configurationEntries[ind]?.value?.toString()"
                placeholder="Type here"
                label="Value"
                class="w-4/12 h-16"
              />
              <div class="flex items-center text-dark_green mt-5">
                <CheckBox
                  :disabled="!state[index]?.configurationEntries[ind]?.isNew"
                  @onChecked="() => check(index, ind)"
                  :checked="state[index].configurationEntries[ind]?.isSecret"
                  :activeGreen="!state[index]?.configurationEntries[ind]?.isNew"
                  class=""
                />
                <span
                  :class="{
                    '': !state[index].configurationEntries[ind].isSecret,
                    'text-green-500': state[index]?.configurationEntries[ind]?.isSecret
                  }"
                  class="pl-2"
                  >Secret</span
                >
              </div>
              <div class="w-24">
                <ButtonInput
                  class="text-sm !text-[#204458] h-11 mt-5"
                  :onClick="() => save(index, ind)"
                  :bg="'bg-[#DEEFFA]'"
                  :loading="loading[index]?.provider && loading[index]?.config[ind]?.save"
                >
                  Save
                </ButtonInput>
              </div>
              <MaterialIcon
                icon="delete"
                class="text-lg mt-5 hover:cursor-pointer"
                v-if="!(loading[index]?.provider && loading[index]?.config[ind]?.delete)"
                @click="setConfigurationToDelete(index, ind)"
              />
              <div v-else class="pt-6">
                <SpinnerComponent />
              </div>
            </div>
            <div class="flex flex-row-reverse w-40 p-2">
              <ButtonInput
                class="text-sm !text-[#204458] h-11"
                :onClick="() => addNewProviderSetting(index)"
                :bg="'bg-[#DEEFFA]'"
              >
                Add Key
              </ButtonInput>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end mb-5 mx-3">
        <div class="w-[13%]" v-if="state.length > 0">
          <ButtonInput
            class="text-sm !text-[#204458] h-9"
            :onClick="() => (addNewProvider = true)"
            :bg="'bg-[#DEEFFA]'"
          >
            Add Provider
          </ButtonInput>
        </div>
      </div>
      <SettlementForm
        :loading="loadingAddProvider"
        @addProvider="(v: string) => addProvider(v)"
        :show="addNewProvider"
        @closeModal="close"
      />
    </div>
    <div v-else class="justify-center items-center mx-auto w-full flex">
      <SpinnerComponent></SpinnerComponent>
    </div>
  </div>
</template>
