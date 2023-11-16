<script lang="ts" setup>
import TextInput from '../inputs/text/TextInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { onMounted, ref } from 'vue'
import type { IProfile } from '@/services/types'
import { useUserStore } from '@/stores/userStore'
import OrganizationService from '@/services/OrganizationService'
import FlagInput from '../inputs/text/FlagInput.vue'
import ChangePassword from '@/components/organizations/ChangePassword.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const countryCode = ref('')
const userStore = useUserStore()
const loading = ref(false)
const state = ref<Partial<IProfile>>({})
const errorMessage = ref<Partial<IProfile>>()
const validationFields: (keyof IProfile)[] = [
  'firstName',
  'lastName',
  'phone',
  'organizationAdminUserId',
  'organizationId'
]
const setState = (key: keyof IProfile, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
const setErrorMessage = (key: keyof IProfile, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}
const errorMessages = (keys: (keyof IProfile)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}
onMounted(() => {
  const names = userStore.user?.name.split(' ')
  if (names) {
    state.value.firstName = names[0]
    state.value.lastName = names[1]
  }
  state.value.phone = userStore.user?.phoneNumber?.slice(3)
  state.value.email = userStore.user?.Email
  state.value.jobRole = userStore.user?.role
  countryCode.value = userStore.user?.phoneNumber?.slice(0, 3) ?? ''
})
const submit = async () => {
  state.value.organizationAdminUserId = userStore.user?.userId
  state.value.organizationId = userStore.user?.organizationId
  if (state.value.phone) if (errorMessages(validationFields)) return
  try {
    loading.value = true
    await OrganizationService.updateUserProfile({
      ...state.value,
      phone: `${countryCode.value.slice(1)}${state.value.phone}`
    })
    const user = userStore.user
    if (user) {
      user.name = `${state.value.firstName} ${state.value.lastName}`
      user.phoneNumber = `${countryCode.value.slice(1)}${state.value.phone}`
      userStore.setUser(user)
    }
    toast.success('Profile updated successfully')
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}
const getAvatar = (name: string) => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
</script>
<template>
  <div class="flex mx-8 my-12 justify-center bg-white rounded-3xl pt-8 pb-36">
    <div class="mx-3 pb-9 p-10 w-full">
      <div class="flex gap-16 p-10">
        <div>
          <div class="rounded-xl bg-[#7585A7] items-center h-28 w-28 justify-center flex">
            <span class="text-6xl font-bold text-white" v-if="userStore.user?.userImage">
              <img :src="userStore.user?.userImage" alt="" class="h-28 w-28 overflow-x-auto" />
            </span>
            <span class="text-6xl font-bold text-white" v-else>
              {{ getAvatar(state.firstName + ' ' + state.lastName ?? '') }}
            </span>
          </div>
        </div>
        <div class="w-full">
          <span class="text-[#062A5F] font-bold">Organization name</span>
          <div class="rounded-xl bg-[#F0F5FF] p-3 mt-2 mb-4">
            <span class="text-[#0D3673] text-lg font-bold">{{
              userStore.user?.organizationName
            }}</span>
          </div>
          <span class="text-[#062A5F] font-bold"
            >Organization code: {{ userStore.user?.organizationCode }}</span
          >
        </div>
      </div>
      <div class="w-full h-full px-10 py-5">
        <div class="flex gap-16">
          <TextInput
            label="First name"
            placeholder="Type here"
            type="text"
            :onChange="(v) => setState('firstName', v)"
            :value="state?.firstName"
            :errorMessage="errorMessage?.firstName"
            class="w-1/2 me-3"
          />
          <TextInput
            label="Last name"
            placeholder="Type here"
            type="text"
            :onChange="(v) => setState('lastName', v)"
            :value="state?.lastName"
            :errorMessage="errorMessage?.lastName"
            class="w-1/2 me-3"
          />
        </div>
        <div class="flex gap-16 pt-3">
          <FlagInput
            :item="countryCode"
            class="w-1/2 me-3"
            label="Your phone number"
            :onChange="(v: string) => setState('phone', v)"
            :selectItem="(v: string) => countryCode = v"
            placeholder="Ex. 08132515487"
            type="text"
            :errorMessage="errorMessage?.phone"
            :value="state?.phone"
          />
          <TextInput
            label="Email"
            placeholder="Type here"
            type="text"
            :onChange="console.log"
            :disabled="true"
            :value="userStore?.user?.Email"
            class="w-1/2 me-3"
          />
        </div>
        <div class="flex gap-16 pt-3">
          <TextInput
            label="Job title"
            placeholder="Type here"
            type="text"
            :onChange="console.log"
            :disabled="true"
            :value="userStore?.user?.jobTitle"
            class="w-full me-3"
          />
          <TextInput
            label="Job Role"
            placeholder="Type here"
            type="text"
            :onChange="console.log"
            :disabled="true"
            :value="userStore?.user?.role"
            class="w-full me-3"
          />
        </div>
        <div class="flex justify-end pt-3">
          <div class="w-44">
            <ButtonInput
              class="text-xs font-bold h-[46px] w-[133px] text-[13px] bg-color me-3"
              :onClick="submit"
              :loading="loading"
              >Save Changes
            </ButtonInput>
          </div>
        </div>
        <hr class="mt-5" />
        <ChangePassword />
      </div>
    </div>
  </div>
</template>
