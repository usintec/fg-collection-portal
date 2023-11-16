<script setup lang="ts">
import TextInput from '@/components/inputs/text/TextInput.vue'
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/AuthService'
import { useToast } from 'vue-toastification'
import ResetPassword from '@/components/reset/ResetPassword.vue'
import Success from '@/components/reset/Success.vue'

const loading = ref(false)
const router = useRouter()

enum LoginStatus {
  LOGIN,
  FORGOT_PASSWORD,
  LINK_SENT
}

const loginStatus = ref<LoginStatus>(LoginStatus.LOGIN)
const toast = useToast()

interface ILogin {
  username?: string
  password?: string
}

const errorMessage = ref<ILogin>()
const values = ref<ILogin>()

const setErrorMessage = (key: keyof ILogin, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const validate = () => {
  let error = false
  if (!values.value?.username) {
    setErrorMessage('username', 'Username is required')
    error = true
  }
  if (!values.value?.password) {
    error = true
    setErrorMessage('password', 'Password is required')
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
      await AuthService.login(values.value?.username!, values.value?.password!)
      toast.success('Login successful')
      return router.push('/')
    } catch (error) {
      console.error(error)
      loading.value = false
      toast.error('Login failed')
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
        v-if="loginStatus === LoginStatus.LOGIN"
        class="bg-white w-[90%] lg:w-1/2 md:w-2/3 xl:w-1/3 rounded-[30px] flex justify-center items-center flex-col py-9"
      >
        <span class="text-dark_green text-center font-satoshi text-2xl font-medium mb-3"
          >Welcome back!</span
        >
        <span class="text-green_regular text-center font-satoshi text-base font-normal"
          >Login to your dashboard</span
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
          <TextInput
            class="mt-2.5"
            label="Password"
            placeholder="Type your password"
            type="password"
            :onChange="(v) => setValue('password', v)"
            :errorMessage="errorMessage?.password"
            :value="values?.password"
          />
          <ButtonInput :loading="loading" class="mt-9" icon="arrow_forward" :onClick="onLogin">
            Login to Dashboard
          </ButtonInput>
        </div>
        <span
          @click="() => (loginStatus = LoginStatus.FORGOT_PASSWORD)"
          class="mt-14 text-dark_green font-satoshi text-center text-base font-normal"
          >Forgot your password?
          <span class="font-bold cursor-pointer hover:underline">Reset it here</span></span
        >
      </div>
      <ResetPassword
        v-if="loginStatus === LoginStatus.FORGOT_PASSWORD"
        @to-login="() => (loginStatus = LoginStatus.LOGIN)"
        @sent-link="() => (loginStatus = LoginStatus.LINK_SENT)"
      />
      <Success
        v-if="loginStatus === LoginStatus.LINK_SENT"
        @go-back="() => (loginStatus = LoginStatus.LOGIN)"
      >
        <template v-slot:big-text>Link Sent!</template>
        <template v-slot:long-text
          >We have sent a link to your email. Please check and change your password</template
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
