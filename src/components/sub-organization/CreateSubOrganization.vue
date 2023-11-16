<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import FormComplete from '../ui-elements/FormComplete.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import { onMounted, ref } from 'vue'
import type { IOrganization } from '@/services/types'
import LookUpService from '@/services/LookUpService'
import OrganizationService from '@/services/OrganizationService'
import { useToast } from 'vue-toastification'
import { useOrganizationStore } from '@/stores/organizationStore'

const loading = ref(false)

const toast = useToast()

interface ChildProps {
  step: number
}

const orgStore = useOrganizationStore()

const props = defineProps<ChildProps>()
const emit = defineEmits<{
  (e: 'next'): void
  (e: 'back'): void
  (e: 'new'): void
}>()

const _step = ref(0)

const state = ref<Partial<IOrganization>>({})
const errorMessage = ref<Partial<IOrganization>>()

const lookUp = ref<Record<string, string[]>>({})
const lookUpLoader = ref(false)

const cityLoader = ref(false)

onMounted(async () => {
  lookUpLoader.value = true
  const states = await LookUpService.states()
  lookUp.value = {
    states
  }
  lookUpLoader.value = false
})

const setState = (key: keyof IOrganization, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const setCountryState = async (name: string) => {
  setState('organizationState', name)
  state.value = { ...state.value, organizationCity: undefined }
  cityLoader.value = true
  const cities = await LookUpService.cites(name)
  lookUp.value = {
    ...lookUp.value,
    cities
  }
  cityLoader.value = false
}

const setErrorMessage = (key: keyof IOrganization, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const back = () => {
  _step.value -= 1
  emit('back')
}

const errorMessages = (keys: (keyof IOrganization)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}

const firstStepKeys: (keyof IOrganization)[] = [
  'organizationCode',
  'organizationName',
  'organizationEmail',
  'organizationWebsite',
  'organizationPhoneNumber'
]

const secondStepKeys: (keyof IOrganization)[] = [
  'organizationContactPersonName',
  'organizationContactPersonEmail',
  'organizationContactPersonPhoneNumber',
  'organizationAddress',
  'organizationCity',
  'organizationState'
]

const next = () => {
  if (_step.value === 0) {
    if (errorMessages(firstStepKeys)) {
      return
    } else {
      _step.value += 1
    }
  } else if (_step.value === 1) {
    if (errorMessages(secondStepKeys)) {
      return
    } else return submit()
  }
  emit('next')
}

const submit = async () => {
  loading.value = true
  try {
    const org = {
      ...state.value,
      parentOrganizationId: orgStore.activeOrganization?.organizationId,
      adminUserInformation: {
        firstName: state.value.organizationContactPersonName?.split(' ')?.shift() ?? '',
        lastName: state.value.organizationContactPersonName?.split(' ')?.[1] ?? '',
        emailAddress: state.value.organizationContactPersonEmail ?? 'test@email.com'
      }
    }
    await OrganizationService.create(org)
    toast.success('Sub Organization created successfully')
    _step.value += 1
    loading.value = false
    emit('next')
  } catch (error) {
    loading.value = false
  }
}

const textValue = (str: string[]) =>
  str.map((s) => ({
    text: s,
    value: s
  }))
</script>

<template>
  <div class="pb-10">
    <div class="w-full">
      <div v-if="props.step === 0">
        <h3 class="text-sm font-normal font-satoshi text-[#6A789A] pb-5">
          Create Sub Organization
        </h3>
        <div class="grid grid-cols-2">
          <div class="me-3">
            <TextInput
              label="Sub Organization name"
              placeholder="Type here"
              type="text"
              :onChange="(v) => setState('organizationName', v)"
              important="*"
              :errorMessage="errorMessage?.organizationName"
              :value="state?.organizationName"
            />
          </div>

          <div>
            <TextInput
              label="Sub Organization code"
              :onChange="(v) => setState('organizationCode', v)"
              important="*"
              :errorMessage="errorMessage?.organizationCode"
              :value="state?.organizationCode"
              placeholder="Type here"
              type="text"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 mt-3">
          <div class="me-3">
            <TextInput
              label="Email address"
              placeholder="organization@example.com"
              type="text"
              :onChange="(v) => setState('organizationEmail', v)"
              important="*"
              :errorMessage="errorMessage?.organizationEmail"
              :value="state?.organizationEmail"
            />
          </div>

          <div>
            <TextInput
              label="Official website"
              placeholder="https://org.win.ng"
              type="text"
              :onChange="(v) => setState('organizationWebsite', v)"
              important="*"
              :errorMessage="errorMessage?.organizationWebsite"
              :value="state?.organizationWebsite"
            />
          </div>
        </div>

        <div class="grid grid-cols mt-3">
          <TextInput
            label="Official phone number"
            placeholder="Ex. 080XXXXXXXX"
            type="number"
            :onChange="(v) => setState('organizationPhoneNumber', v)"
            important="*"
            :errorMessage="errorMessage?.organizationPhoneNumber"
            :value="state?.organizationPhoneNumber"
          />
        </div>

        <div class="mt-11 flex justify-between">
          <div class="pt-3"></div>
          <div class="">
            <ButtonInput
              :loading="loading"
              class="h-[46px] text-[13px] mt-9"
              icon="keyboard_double_arrow_right"
              :onClick="next"
            >
              Continue
            </ButtonInput>
          </div>
        </div>
      </div>

      <div v-if="step === 1">
        <h3 class="text-sm font-normal font-satoshi text-[#6A789A] pb-5">
          Sub Organization Contact person information
        </h3>
        <div class="grid grid-cols pb-5">
          <div>
            <TextInput
              label="Contact Person Name"
              placeholder="Ex. John"
              type="text"
              :onChange="(v) => setState('organizationContactPersonName', v)"
              important="*"
              :errorMessage="errorMessage?.organizationContactPersonName"
              :value="state?.organizationContactPersonName"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 mt-3">
          <div class="me-3">
            <TextInput
              label="Email address"
              placeholder="Ex. user@organization.com"
              type="text"
              :onChange="(v) => setState('organizationContactPersonEmail', v)"
              important="*"
              :errorMessage="errorMessage?.organizationContactPersonEmail"
              :value="state?.organizationContactPersonEmail"
            />
          </div>

          <div>
            <TextInput
              label="Official phone number(s)"
              placeholder="Ex. 080XXXXXXXX"
              type="text"
              :onChange="(v) => setState('organizationContactPersonPhoneNumber', v)"
              important="*"
              :errorMessage="errorMessage?.organizationContactPersonPhoneNumber"
              :value="state?.organizationContactPersonPhoneNumber"
            />
          </div>
        </div>

        <div class="pt-5">
          <span class="font-satoshi text-sm font-medium text-[#6A789A]"
            >Sub Organization location information</span
          >
        </div>
        <div class="grid grid-cols mt-3">
          <div>
            <TextInput
              label="SubOrganization Organization address"
              placeholder="Type here"
              type="text"
              :onChange="(v) => setState('organizationAddress', v)"
              important="*"
              :errorMessage="errorMessage?.organizationAddress"
              :value="state?.organizationAddress"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 mt-3">
          <div class="me-3">
            <SelectInput
              label="State"
              :onChange="setCountryState"
              :selected="state.organizationState"
              value="value"
              :name="['text']"
              :items="textValue(lookUp['states'])"
              :errorMessage="errorMessage?.organizationState"
              important
            />
          </div>

          <div>
            <SelectInput
              label="City"
              :onChange="(v) => setState('organizationCity', v)"
              :selected="state.organizationCity"
              value="value"
              :name="['text']"
              :items="textValue(lookUp['cities'] ?? [])"
              :errorMessage="errorMessage?.organizationCity"
              :loading="cityLoader"
              :noDataMessage="
                lookUp['cities'] === undefined && !cityLoader
                  ? 'Please select state first'
                  : undefined
              "
              important
            />
          </div>
        </div>

        <div class="grid grid-cols">
          <div class="mt-10 flex justify-between">
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
                :onClick="next"
              >
                Continue
              </ButtonInput>
            </div>
          </div>
        </div>
      </div>

      <div v-if="step === 2">
        <FormComplete
          successText="Created Successfully"
          text="New sub organization created successfully. You can view and edit details or create another"
        />
      </div>
    </div>
  </div>
</template>
