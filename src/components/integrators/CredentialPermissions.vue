<script setup lang="ts">
import Modal from '../modal/Modal.vue'
import TextInput from '../inputs/text/TextInput.vue'
import CheckBox from '../inputs/check/CheckBox.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { ref, onMounted, watch } from 'vue'
import type { IData, IKeyPermit, IKey } from '@/services/types'
import ApiKeyService from '@/services/ApiKeyService'
import Accordion from '../accordion/Accordion.vue'
import { useToast } from 'vue-toastification'

const permits = ref<IData[]>([])
const isChecked = ref<Record<string, boolean>>({})
const loading = ref(false)
const searchTerm = ref('')
const isActive = ref(false)
const toast = useToast()
const inputs = ref<{ value: string; isValid: boolean }[]>([])

const props = defineProps<{
  show: boolean
  live?: boolean
  id?: any | undefined
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const keyPermits = ref<IKeyPermit[]>([])
const oneKey = ref<IKey>()

const pull = async () => {
  loading.value = true
  const data = await ApiKeyService.getAll()
  permits.value = data
  loading.value = false

  if (data.length === 0) {
    inputs.value = [{ value: '', isValid: true }]
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

const state = ref<Partial<IKey>>({})
const setState = (key: keyof IKey, value: string) => {
  state.value = { ...state.value, [key]: value }
}
const setIpState = (key: keyof IKey, value: string[]) => {
  state.value = { ...state.value, [key]: value }
}

const onFilter = (event: any) => {
  searchTerm.value = event.target.value
}

onMounted(() => {
  pull()
})

watch(
  () => state.value.allowedIPs,
  (newAllowedIPs = []) => {
    inputs.value = [{ value: '', isValid: true }]
    inputs.value.push(...newAllowedIPs.map((ip) => ({ value: ip, isValid: true })))
  }
)

watch(
  () => props.live,
  (newName) => {
    isActive.value = newName
  },
  { immediate: true }
)

watch(
  () => props.id,
  async (id) => {
    const keyPermit = await ApiKeyService.getKeyPermission(id)
    keyPermits.value = keyPermit
    isChecked.value = {}

    if (keyPermits.value) {
      Object.keys(keyPermits.value).forEach((category: string) => {
        const permissionsArray = (keyPermits.value as Record<string, any>)[category]

        if (Array.isArray(permissionsArray)) {
          permissionsArray.forEach((permission) => {
            if (permission && typeof permission === 'object') {
              const code = permission.code
              isChecked.value[code] = true
            }
          })
        }
      })
    }
  },
  { immediate: true }
)

watch(
  () => props.id,
  async (id) => {
    const get = await ApiKeyService.getOne(id)
    oneKey.value = get

    state.value = {
      id: oneKey.value?.id,
      name: oneKey.value?.name,
      callbackUrl: oneKey.value?.callbackUrl,
      isLive: oneKey.value?.isLive,
      allowedIPs: oneKey.value?.allowedIPs || [],
      permissions: oneKey.value?.permissions || []
    }
  }
)

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
  setIpState('allowedIps', ipsArray)
}

const submit = async () => {
  loading.value = true
  state.value.permissions = Object.keys(isChecked.value).filter((code) => isChecked.value[code])
  try {
    await ApiKeyService.editKey(`${state.value?.id}`, state.value)
    toast.success('Edited successfully')
    loading.value = false
    emit('closeModal')
  } catch (error) {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      title="Credential permissions"
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
              label=" "
              :onChange="console.log"
              @input="onFilter"
              placeholder="Search"
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

          <Accordion :items="permits">
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
            <div class="my-5"></div>
            <div class="w-2/5">
              <ButtonInput class="text-sm bg-[#D8E8F2]" :onClick="submit" :loading="loading">
                Save Changes
              </ButtonInput>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
