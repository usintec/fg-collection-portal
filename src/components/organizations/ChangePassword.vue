<script lang="ts" setup>
import TextInput from '../inputs/text/TextInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { ref } from 'vue'
import type { IChangePassword } from '@/services/types'
import UserService from '@/services/UserService'
import { useToast } from 'vue-toastification'

const toast = useToast()
const loading = ref(false)
const state = ref<Partial<IChangePassword>>({})
const errorMessage = ref<Partial<IChangePassword>>()
const validationFields: (keyof IChangePassword)[] = [
  'newPassword',
  'currentPassword',
  'confirmPassword'
]
const setState = (key: keyof IChangePassword, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
const setErrorMessage = (key: keyof IChangePassword, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}
const errorMessages = (keys: (keyof IChangePassword)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}
const submit = async () => {
  if (state.value.confirmPassword !== state.value.newPassword) {
    toast.error('Confirm password is incorrect')
    return
  }
  if (errorMessages(validationFields)) return
  try {
    loading.value = true
    await UserService.changePassword(state.value)
    toast.success('Password changes successfully')
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}
</script>
<template>
  <div>
    <div class="flex gap-5 pt-3">
      <TextInput
        label="Old Password"
        placeholder="Type your password"
        :absolute="true"
        type="password"
        :onChange="(v) => setState('currentPassword', v)"
        :value="state?.currentPassword"
        :errorMessage="errorMessage?.currentPassword"
        class="w-1/2 me-3"
      />
      <TextInput
        label="New Password"
        placeholder="Type your password"
        :absolute="true"
        type="password"
        :onChange="(v) => setState('newPassword', v)"
        :value="state?.newPassword"
        :errorMessage="errorMessage?.newPassword"
        class="w-[45%] me-3"
      />
    </div>
    <div class="flex gap-16 justify-between pt-3">
      <TextInput
        label="Confirm Password"
        placeholder="Type your password"
        :absolute="true"
        type="password"
        :onChange="(v) => setState('confirmPassword', v)"
        :value="state?.confirmPassword"
        :errorMessage="errorMessage?.confirmPassword"
        class="w-1/2 me-3"
      />
      <div class="w-44 pt-8">
        <ButtonInput
          class="text-xs font-bold h-[46px] w-[133px] text-[13px] bg-color me-3"
          :onClick="submit"
          :loading="loading"
          >Save Changes
        </ButtonInput>
      </div>
    </div>
  </div>
</template>
