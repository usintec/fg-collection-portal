<script setup lang="ts">
import IntegratorService from '@/services/IntegratorService'
import type { IIntegrator } from '@/services/types'
import { onMounted, ref } from 'vue'
import TextInput from '../inputs/text/TextInput.vue'
import Modal from '../modal/Modal.vue'
import { useToast } from 'vue-toastification'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Radio from '../inputs/radio/Radio.vue'
import FlagInput from '../inputs/text/FlagInput.vue'

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const options = [
  { label: 'Individual', value: 'individual' },
  { label: 'Business', value: 'business' }
]

onMounted(async () => {})

const selectedOption = ref(options[0].value)
const isDisabled = ref(false)

const onCheck = (newValue: string) => {
  selectedOption.value = newValue
  setState('integratorType', newValue)
}

const toast = useToast()

const loading = ref(false)
const state = ref<Partial<IIntegrator>>({})
const errorMessage = ref<Partial<IIntegrator>>()

const setState = (key: keyof IIntegrator, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const setErrorMessage = (key: keyof IIntegrator, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const errorMessages = (keys: (keyof IIntegrator)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}

const individual: (keyof IIntegrator)[] = ['name', 'email', 'callbackUrl']

const business: (keyof IIntegrator)[] = ['name', 'email', 'callbackUrl']

const next = () => {
  if (selectedOption.value == 'individual') {
    if (errorMessages(individual)) {
      return
    } else {
      return submit()
    }
  }

  if (selectedOption.value == 'business') {
    if (errorMessages(business)) {
      return
    } else {
      return submit()
    }
  }
}

const submit = async () => {
  loading.value = true
  try {
    await IntegratorService.create(state.value)
    toast.success('Created successfully')
    loading.value = false

    state.value = {}
    errorMessage.value = {}
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
      title="Add new Integrator"
      width="w-11/12 lg:w-1/2 xl:w-5/12 2xl:w-1/4"
    >
      <template v-slot:content>
        <div class="">
          <div class="">
            <div class="flex gap-4 w-10/12 my-5">
              <span class="font-medium font-satoshi text-[#204458]"> Integrator Type: </span>
              <Radio
                v-for="(option, index) in options"
                :key="index"
                v-model="selectedOption"
                :value="option.value"
                :label="option.label"
                @onChecked="onCheck"
                :name="'radio-group'"
                :defaultChecked="option.value === 'individual'"
                :disabled="isDisabled"
                activeGreen
              />
            </div>

            <div class="mt-7 w-10/12">
              <div class="grid grid-cols" v-if="selectedOption === 'individual'">
                <div class="me-3">
                  <TextInput
                    label="Full Name"
                    :onChange="(v) => setState('name', v)"
                    important="*"
                    placeholder="Type here"
                    type="text"
                    :errorMessage="errorMessage?.name"
                    :value="state?.name"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 mt-3" v-if="selectedOption === 'individual'">
                <div class="me-3">
                  <TextInput
                    label="Email address"
                    :onChange="(v) => setState('email', v)"
                    placeholder="Type here"
                    type="text"
                    :errorMessage="errorMessage?.email"
                    :value="state?.email"
                  />
                </div>

                <div class="">
                  <FlagInput
                    label="Your phone number"
                    :onChange="(v) => setState('phoneNumber', v)"
                    :selectItem="(v) => setState('countryCode', v)"
                    placeholder="Ex. 08132515487"
                    type="text"
                    :errorMessage="errorMessage?.phoneNumber"
                    :value="state?.phoneNumber"
                  />
                </div>
              </div>
              <div class="grid grid-cols my-3" v-if="selectedOption === 'individual'">
                <div class="">
                  <TextInput
                    label="Callback URL"
                    :onChange="(v) => setState('callbackUrl', v)"
                    placeholder="https://www.domain.com"
                    type="text"
                    :errorMessage="errorMessage?.callbackUrl"
                    :value="state?.callbackUrl"
                  />
                </div>
              </div>

              <div class="grid grid-cols" v-if="selectedOption === 'business'">
                <div class="me-3">
                  <TextInput
                    label="Company Name"
                    :onChange="(v) => setState('name', v)"
                    important="*"
                    placeholder="Type here"
                    type="text"
                    :errorMessage="errorMessage?.name"
                    :value="state?.name"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 mt-3" v-if="selectedOption === 'business'">
                <div class="me-3">
                  <TextInput
                    label="Email address"
                    :onChange="(v) => setState('email', v)"
                    placeholder="Type here"
                    type="text"
                    :errorMessage="errorMessage?.email"
                    :value="state?.email"
                  />
                </div>

                <div class="">
                  <FlagInput
                    label="Your phone number"
                    :onChange="(v) => setState('phoneNumber', v)"
                    :selectItem="(v) => setState('countryCode', v)"
                    placeholder="Ex. 08132515487"
                    type="text"
                    :errorMessage="errorMessage?.phoneNumber"
                    :value="state?.phoneNumber"
                  />
                </div>
              </div>

              <div class="grid grid-cols my-3" v-if="selectedOption === 'business'">
                <div class="">
                  <TextInput
                    label="Callback URL"
                    :onChange="(v) => setState('callbackUrl', v)"
                    placeholder="https://www.domain.com"
                    type="text"
                    :errorMessage="errorMessage?.callbackUrl"
                    :value="state?.callbackUrl"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <div class="flex gap-5">
                <div class="">
                  <ButtonInput
                    class="mt-9 px-5 text-sm bg-[#D8E8F2]"
                    :onClick="() => emit('closeModal')"
                  >
                    Cancel
                  </ButtonInput>
                </div>

                <div>
                  <ButtonInput class="mt-9 text-sm px-5" :loading="loading" :onClick="next">
                    Save Details
                  </ButtonInput>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
