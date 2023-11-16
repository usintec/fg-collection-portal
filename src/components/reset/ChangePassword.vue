<script setup lang="ts">
import TextInput from '@/components/inputs/text/TextInput.vue'
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import { ref } from 'vue'
import UserService from '@/services/UserService'
import { useRouter } from 'vue-router'
import Success from './Success.vue'
const router = useRouter()

const loading = ref(false)

enum RESET_STATUS {
  CHANGE_PASSWORD,
  PASSWORD_CHANGED
}

interface ILogin {
  confirmPassword?: string
  password?: string
}

interface Emit {
  (key: 'onChange'): void
  (key: 'onLogin'): void
}

defineEmits<Emit>()
const resetStatus = ref<RESET_STATUS>(RESET_STATUS.CHANGE_PASSWORD)

// get query string
const query = router.currentRoute.value.query
const resetCode = query?.code as string
const username = query?.username as string

const errorMessage = ref<ILogin>()
const values = ref<ILogin>()

const setErrorMessage = (key: keyof ILogin, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const validate = () => {
  let error = false
  if (!values.value?.confirmPassword) {
    setErrorMessage('confirmPassword', 'Username is required')
    error = true
  }
  if (!values.value?.password) {
    error = true
    setErrorMessage('password', 'Password is required')
  }

  if (values.value?.confirmPassword !== values.value?.password) {
    error = true
    setErrorMessage('confirmPassword', 'Password does not match')
  }
  return error
}

const setValue = (key: keyof ILogin, value: string) => {
  values.value = { ...values.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const onLogin = async () => {
  if (validate()) {
    return
  } else {
    try {
      loading.value = true
      await UserService.resetPassword({
        username,
        newPassword: values.value?.password ?? '',
        resetCode
      })
      resetStatus.value = RESET_STATUS.PASSWORD_CHANGED
    } catch (error) {
      console.error(error)
      loading.value = false
    }
  }
}
</script>

<template>
  <div class="bg-dark_green">
    <div class="login-bg flex flex-col items-center justify-center">
      <span class="text-white text-center font-satoshi text-2xl font-black"
        >REV<span class="font-normal">ASSURE</span></span
      >
      <span class="text-mini font-satoshi text-center text-base font-normal mb-8"
        >Back office Portal</span
      >
      <div
        v-if="resetStatus === RESET_STATUS.CHANGE_PASSWORD"
        class="bg-white w-[90%] lg:w-1/2 md:w-2/3 xl:w-1/3 rounded-[30px] flex justify-center items-center flex-col py-9"
      >
        <span class="text-dark_green text-center font-satoshi text-2xl font-medium mb-3"
          >Reset Password</span
        >
        <span class="text-green_regular text-center font-satoshi text-base font-normal"
          >please enter your email below</span
        >
        <div class="w-2/3 px-2 mt-9">
          <TextInput
            label="New Password"
            placeholder="Type here"
            type="password"
            :onChange="(v) => setValue('password', v)"
            :errorMessage="errorMessage?.password"
            :value="values?.password"
          />
          <TextInput
            class="mt-2.5"
            label="Type password again"
            placeholder="Type your password"
            type="password"
            :onChange="(v) => setValue('confirmPassword', v)"
            :errorMessage="errorMessage?.confirmPassword"
            :value="values?.confirmPassword"
          />
          <ButtonInput :loading="loading" class="mt-9" icon="arrow_forward" :onClick="onLogin">
            Change your password
          </ButtonInput>
        </div>
        <span
          @click="() => router.push('/login')"
          class="mt-14 text-dark_green font-satoshi text-center text-base font-normal"
          >Remember password?
          <span class="font-bold cursor-pointer hover:underline">Login here</span></span
        >
      </div>

      <Success
        v-if="resetStatus === RESET_STATUS.PASSWORD_CHANGED"
        @go-back="() => router.push('/login')"
      >
        <template v-slot:big-text>Password Changed!</template>
        <template v-slot:long-text
          >Your password was changed successfully! Continue to login.</template
        >
        <template v-slot:button-text>Login</template>
      </Success>
    </div>
  </div>
</template>

<style scoped>
.login-bg {
  background-image: url('../assets/login_bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
}

.text-mini {
  color: #91c1dc;
}
</style>
