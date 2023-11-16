<script setup lang="ts">
import Modal from '../modal/Modal.vue'
import TextInput from '../inputs/text/TextInput.vue'
import CheckBox from '../inputs/check/CheckBox.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { ref, onMounted, computed } from 'vue'
import type { IPermission, IIntegrator, IKey, IData } from '@/services/types'
import Accordion from '../accordion/Accordion.vue'
import Toggle from '../inputs/toggle/Toggle.vue'
import IntegratorService from '@/services/IntegratorService'
import { useToast } from 'vue-toastification'
import ApiKeyService from '@/services/ApiKeyService'

const permits = ref<IData[]>([])
const isChecked = ref<Record<string, boolean>>({})
const loading = ref(false)
const searchTerm = ref('')
const isActive = ref(false)
const inputs = ref([{ value: '', isValid: true }])
const toast = useToast()

const props = defineProps<{
  info: Partial<IIntegrator>
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const pull = async () => {
  loading.value = true
  const data = await ApiKeyService.getAll()
  permits.value = data
  loading.value = false
}

const toggle = () => {
  isActive.value = !isActive.value
  isLiveState('isLive', isActive.value)
}

const state = ref<Partial<IKey>>({})
const errorMessage = ref<Partial<IKey>>()
const permitState = ref<IPermission>({} as IPermission)

const setState = (key: keyof IKey, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
const setIpState = (key: keyof IKey, value: string[]) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
const isLiveState = (key: keyof IIntegrator, value: boolean) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const setErrorMessage = (key: keyof IKey, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const errorMessages = (keys: (keyof IKey)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}

const key: (keyof IKey)[] = ['name', 'callbackUrl']

const next = () => {
  if (errorMessages(key)) {
    return
  } else {
    return submit()
  }
}

const addMore = (index: any) => {
  const inputValue = inputs.value[index].value.trim()
  if (inputValue === '') {
    inputs.value[index].isValid = false
    return
  }
  const newValue = inputs.value[index].value
  inputs.value.splice(index + 1, 0, { value: '', isValid: true })
  inputs.value[index].value = ''
  inputs.value[index + 1].value = newValue
  updateAllowedIps()
}

const removeRow = (index: number) => {
  inputs.value.splice(index, 1)
  updateAllowedIps()
}

const updateInput = (index: any, value: any) => {
  inputs.value[index].value = value
  inputs.value[index].isValid = true
  updateAllowedIps()
}
const updateAllowedIps = () => {
  const ipsArray = inputs.value.map((input) => input.value.trim()).filter((ip: string) => ip !== '')
  state.value.allowedIps = ipsArray
  setIpState('allowedIps', ipsArray)
}

const submit = async () => {
  loading.value = true
  state.value.permissions = Object.keys(isChecked.value).filter((code) => isChecked.value[code])
  try {
    await IntegratorService.createKey(`${props.info.id}`, state.value)

    toast.success('Created successfully')
    loading.value = false

    state.value = {}
    inputs.value = [{ value: '', isValid: true }]
    state.value = {
      allowedIps: []
    }
    isChecked.value = {}
    permitState.value = {} as IPermission
    isActive.value = false
    emit('closeModal')
  } catch (error) {
    loading.value = false
  }
}

const onCheck = (code: string) => {
  isChecked.value = {
    ...isChecked.value,
    [code]: !isChecked.value[code]
  }
}

const formatPermission = (permission: string) => {
  return permission
    .split(/(?=[A-Z])/)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

const onFilter = (event: any) => {
  searchTerm.value = event.target.value
}

const filteredPermits = computed(() => {
  if (!searchTerm.value.trim()) {
    return permits.value
  }

  return permits.value.filter((permit) => permit[searchTerm.value] !== undefined)
})

onMounted(() => {
  pull()
})
</script>

<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      title="Create new credential"
      width="w-11/12 lg:w-1/2 xl:w-5/12 2xl:w-1/4"
    >
      <template v-slot:content>
        <div class="mt-5">
          <div class="mb-5 relative">
            <TextInput
              label="API key name"
              :onChange="(v) => setState('name', v)"
              placeholder="Type here"
              type="text"
              class="mb-3"
              :errorMessage="errorMessage?.name"
              :value="state?.name"
            />
          </div>

          <div class="mb-5 relative">
            <TextInput
              label="Callback URL"
              :onChange="(v) => setState('callbackUrl', v)"
              placeholder="https://www.domain.com"
              type="text"
              class="mb-3"
              :errorMessage="errorMessage?.callbackUrl"
              :value="state?.callbackUrl"
            />
          </div>

          <div class="mb-5 border-b">
            <span>Add IP addresses</span>

            <div
              class="flex gap-3 pb-5 justify-center items-center"
              v-for="(input, index) in inputs"
              :key="index"
            >
              <div class="w-full">
                <TextInput
                  label=""
                  :value="input.value"
                  :onChange="(value) => updateInput(index, value)"
                  placeholder="123.45.67"
                  type="text"
                  :errorMessage="input.isValid ? '' : 'false'"
                />
              </div>

              <div v-if="index === 0" class="w-1/4">
                <ButtonInput class="text-sm bg-[#D8E8F2]" :onClick="() => addMore(index)">
                  Add
                </ButtonInput>
              </div>
              <div v-else class="w-1/4">
                <ButtonInput class="text-sm" bg="bg-[#FF7373]" :onClick="() => removeRow(index)">
                  Remove
                </ButtonInput>
              </div>
            </div>
          </div>

          <div class="mb-5">
            <TextInput
              label="Search Role"
              :onChange="console.log"
              @input="onFilter"
              placeholder="Ex. Role Name"
              type="text"
              class="mb-3 h-[70px]"
            />
          </div>

          <!-- <div
            class="py-5 bg-[#FFD0D6] rounded"
            v-if="Object.keys(filteredPermissions).length === 0"
          >
            <p class="text-center font-medium text-[#204458]">Role Not Found!</p>
          </div> -->
          <Accordion :items="filteredPermits">
            <template v-slot:header="{ index }">
              <h3>{{ index }}</h3>
            </template>
            <template v-slot="{ item }">
              <div class="mb-7">
                <div class="grid grid-cols-2 md:grid-cols-2">
                  <div
                    class="flex items-center mt-3 gap-3"
                    v-for="permission in item"
                    :key="permission.code"
                  >
                    <CheckBox
                      :checked="isChecked[permission.code]"
                      :activeGreen="isChecked[permission.code]"
                      @onChecked="onCheck(permission.code)"
                    />
                    <p class="text-sm">{{ formatPermission(permission.code) }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Accordion>

          <div class="w-full mt-8 flex justify-between">
            <div class="my-5">
              <Toggle :isActive="isActive" :onChange="toggle" />
              <span>Live Environment</span>
            </div>
            <div class="w-2/5">
              <ButtonInput class="text-sm bg-[#D8E8F2]" :onClick="next" :loading="loading">
                Add Key
              </ButtonInput>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style>
.input-invalid {
  border: 1px solid;
  border-color: rgb(220 38 38);
  border-radius: 8px;
  padding: 0 !important;
  margin: 0 !important;
  height: auto;
  overflow: hidden;
  white-space: nowrap;
}
</style>
