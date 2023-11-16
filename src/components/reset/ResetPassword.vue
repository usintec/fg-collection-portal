<script setup lang="ts">
import { ref } from 'vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import TextInput from '../inputs/text/TextInput.vue'
import UserService from '@/services/UserService'

interface ILogin {
  username?: string
}

interface Emit {
  (e: 'toLogin'): void
  (e: 'sentLink'): void
}

const emit = defineEmits<Emit>()

const errorMessage = ref<ILogin>()
const values = ref<ILogin>()

const setErrorMessage = (key: keyof ILogin, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const setValue = (key: keyof ILogin, value: string) => {
  values.value = { ...values.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const validate = () => {
  let error = false
  if (!values.value?.username) {
    setErrorMessage('username', 'Username is required')
    error = true
  }
  return error
}

const onLogin = async () => {
  if (validate()) {
    return
  } else {
    try {
      loading.value = true
      await UserService.requestPassword(values.value?.username ?? '')
      emit('sentLink')
    } catch (error) {
      console.log(error)
      loading.value = false
    }
  }
}

const loading = ref(false)
</script>
<template>
  <div
    class="bg-white w-[90%] lg:w-1/2 md:w-2/3 xl:w-1/3 rounded-[30px] flex justify-center items-center flex-col py-9"
  >
    <span class="text-dark_green text-center font-satoshi text-2xl font-medium mb-3"
      >Forgot your password?</span
    >
    <span class="text-green_regular text-center font-satoshi text-base font-normal"
      >please enter your email below</span
    >
    <div class="w-2/3 px-2 mt-9">
      <TextInput
        label="Username / Email address"
        placeholder="you@example.com"
        type="email"
        :onChange="(v) => setValue('username', v)"
        :errorMessage="errorMessage?.username"
        :value="values?.username"
      />

      <ButtonInput :loading="loading" class="mt-9" :onClick="onLogin">
        Send Reset Link
      </ButtonInput>

      <div class="text-dark_green text-sm font-normal my-9 w-full flex justify-center items-center">
        I remember my password
      </div>
    </div>
    <span
      @click="() => $emit('toLogin')"
      class="mt-14 text-dark_green font-satoshi text-center text-base font-normal"
      >Remember password?
      <span class="font-bold cursor-pointer hover:underline">Login here</span></span
    >
  </div>
</template>
