<script setup lang="ts">
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { onMounted, ref } from 'vue'
import FormComplete from '../ui-elements/FormComplete.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import type { AdminUserInformation, IOrganization, ILookUp } from '@/services/types'
import OrganizationService from '@/services/OrganizationService'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import LookUpService from '@/services/LookUpService'

const toast = useToast()
const router = useRouter()

interface ChildProps {
  step: number
}

const props = defineProps<ChildProps>()
const emit = defineEmits<{
  (e: 'next'): void
  (e: 'back'): void
  (e: 'new'): void
}>()

const _step = ref(0)
const loading = ref(false)
const parentOrganizations = ref<ILookUp[]>([])
const newCreatedId = ref<string>()

const state = ref<Partial<IOrganization>>({})
const errorMessage = ref<Partial<IOrganization>>()
const adminState = ref<AdminUserInformation>({} as AdminUserInformation)
const adminErrorMessage = ref<Partial<AdminUserInformation>>()

const lookUp = ref<Record<string, string[]>>({})
const lookUpLoader = ref(false)

const cityLoader = ref(false)

onMounted(async () => {
  lookUpLoader.value = true
  const res = await OrganizationService.getParentOrg()
  parentOrganizations.value = res
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

const setAdminState = (key: keyof AdminUserInformation, value: string) => {
  adminState.value = { ...adminState.value, [key]: value }
  adminErrorMessage.value = { ...adminErrorMessage.value, [key]: undefined }
}

const setAdminErrorMessage = (key: keyof AdminUserInformation, message: string) => {
  adminErrorMessage.value = { ...adminErrorMessage.value, [key]: message }
}

const firstStepKeys: (keyof IOrganization)[] = [
  'parentOrganizationId',
  'organizationCode',
  'organizationName',
  'organizationEmail',
  'organizationWebsite'
]

const secondStepKeys: (keyof IOrganization)[] = [
  'organizationContactPersonName',
  'organizationContactPersonEmail',
  'organizationContactPersonPhoneNumber',
  'organizationAddress',
  'organizationCity',
  'organizationState'
]

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

const _adminErrorMessage = () => {
  const keys: (keyof AdminUserInformation)[] = ['emailAddress', 'firstName', 'lastName']

  let error = false
  for (const key of keys) {
    if (!adminState.value[key]) {
      setAdminErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}

const back = () => {
  _step.value -= 1
  emit('back')
}

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
    } else {
      _step.value += 1
    }
  } else if (_step.value === 2) {
    if (_adminErrorMessage()) {
      return null
    } else return submit()
  }
  emit('next')
}

const submit = async () => {
  loading.value = true
  state.value.adminUserInformation = adminState.value
  try {
    const res = await OrganizationService.create(state.value)
    newCreatedId.value = res.value.organizationId
    toast.success('Organization created successfully')
    _step.value += 1
    loading.value = false
    emit('next')
  } catch (error) {
    loading.value = false
  }
}

const createNew = () => {
  state.value = {}
  adminState.value = {} as AdminUserInformation
  errorMessage.value = {}
  adminErrorMessage.value = {}
  _step.value = 0
  emit('new')
}

const textValue = (str: string[]) =>
  str.map((s) => ({
    text: s,
    value: s
  }))

const gotoDetailPage = () => {
  router.push(`/organizations/detail/${newCreatedId.value}`)
}
</script>

<template>
  <div class="px-0" v-if="props.step === 0">
    <h3 class="text-lg font-bold font-satoshi">Add your first Organization</h3>

    <div class="mt-3 gap-2">
      <div class="grid grid-cols-2">
        <div class="me-3">
          <SelectInput
            label="Parent Organization"
            :onChange="(v) => setState('parentOrganizationId', v)"
            important
            :errorMessage="errorMessage?.parentOrganizationId"
            :selected="state?.parentOrganizationId ?? ''"
            value="id"
            :name="['displayName']"
            :items="parentOrganizations"
            :loading="lookUpLoader"
          />
        </div>

        <div class="">
          <TextInput
            label="Organization code"
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
        <div class="col-span-2">
          <TextInput
            label="Organization name"
            placeholder="Type here"
            type="text"
            :onChange="(v) => setState('organizationName', v)"
            important="*"
            :errorMessage="errorMessage?.organizationName"
            :value="state?.organizationName"
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
        <div class="col-span-2">
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
      </div>

      <div class="flex justify-end">
        <div class="w-1/4">
          <ButtonInput
            :loading="loading"
            class="h-[46px] text-[13px] mt-9 w-1/2"
            icon="keyboard_double_arrow_right"
            :onClick="next"
          >
            Continue
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>

  <div class="px-0" v-if="props.step === 1">
    <p class="text-sm font-satoshi text-[#6A789A]">Organization contact person information</p>
    <div class="mt-5">
      <div class="grid grid-cols-2">
        <div class="col-span-2">
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
      <p class="text-sm font-satoshi text-[#6A789A] mt-10 mb-4">
        Organization contact person Address
      </p>

      <div class="grid grid-cols-2">
        <div class="col-span-2">
          <TextInput
            label="Organization address"
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
        <div class="mt-5 flex justify-between">
          <div class="pt-3 flex hover:cursor-pointer" @click="back">
            <span class="bg-[#CADFEB] rounded-full w-7 h-7 flex justify-center items-center me-2">
              <MaterialIcon outline icon="chevron_left" class="text-black rounded-full bg-green" />
            </span>
            <span class="text-sm font-medium pt-1"> Go Back </span>
          </div>
          <div class="w-1/4">
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
  </div>
  <div class="px-0" v-if="props.step === 2">
    <p class="text-sm font-satoshi text-[#6A789A]">Create organization administrator</p>
    <div class="grid grid-cols-2 mt-5">
      <div class="me-3">
        <TextInput
          label="First Name"
          placeholder="Ex. John"
          type="text"
          :onChange="(v) => setAdminState('firstName', v)"
          important="*"
          :errorMessage="adminErrorMessage?.firstName"
          :value="adminState?.firstName"
        />
      </div>

      <TextInput
        label="Last Name"
        placeholder="Ex. Doe"
        type="text"
        :onChange="(v) => setAdminState('lastName', v)"
        important="*"
        :errorMessage="adminErrorMessage?.lastName"
        :value="adminState?.lastName"
      />
    </div>
    <div class="mt-3">
      <div class="grid grid-cols-2">
        <div class="col-span-2">
          <TextInput
            label="Email address"
            placeholder="organization@example.com"
            type="text"
            :onChange="(v) => setAdminState('emailAddress', v)"
            important="*"
            :errorMessage="adminErrorMessage?.emailAddress"
            :value="adminState?.emailAddress"
          />
        </div>
      </div>
      <div class="grid grid-cols">
        <div class="mt-5 flex justify-between">
          <div class="pt-3 flex hover:cursor-pointer" @click="back">
            <span class="bg-[#CADFEB] rounded-full w-7 h-7 flex justify-center items-center me-2">
              <MaterialIcon outline icon="chevron_left" class="text-black rounded-full bg-green" />
            </span>
            <span class="text-sm font-medium pt-1"> Go Back </span>
          </div>
          <div class="w-1/4">
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
  </div>

  <FormComplete
    v-if="step === 3"
    successText="All done and Successful!"
    text="You have successfully completed the first steps of setting up your organization. You can
          proceed to your dashboard."
  >
    <div class="w-full flex gap-4 text-[13px] text-thin">
      <div class="flex justify-center w-2/3">
        <ButtonInput type="button" class="mt-9" :onClick="createNew" id="closeButton">
          Create new
        </ButtonInput>
      </div>
      <div class="flex justify-center w-2/3">
        <ButtonInput type="button" class="mt-9" :onClick="gotoDetailPage" id="closeButton">
          View Details
        </ButtonInput>
      </div>
    </div>
  </FormComplete>
</template>
