<script setup lang="ts">
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { useRouter } from 'vue-router'
import type { IBank, IAccount } from '@/services/types'
import LookUpService from '@/services/LookUpService'
import { onMounted, ref } from 'vue'
import IntegrationsService from '@/services/IntegrationsService'
import SpinnerComponent from '../loader/SpinnerComponent.vue'

const router = useRouter()
const banks = ref<IBank[]>()
const accountInfo = ref<IAccount>()
const accountBalance = ref<IAccount>()
const loading = ref(false)
const balanceFormat = ref<string | null>('N/A')

const state = ref<Partial<IAccount>>({})
const setState = (key: keyof IAccount, value: string | boolean) => {
  state.value = { ...state.value, [key]: value }
}

const submit = async (code: any) => {
  loading.value = true
  setState('bankCode', code)

  const data = await IntegrationsService.accountInfoLookup(state.value)
  accountInfo.value = data?.value

  const datas = await IntegrationsService.accountBalanceLookup(state.value)
  accountBalance.value = datas?.value
  loading.value = false
  balanceFormat.value = accountBalance.value.balance?.toLocaleString() ?? 'N/A'
}

const view = () => {
  router.push(`/settings/account-balances`)
}

onMounted(async () => {
  banks.value = await LookUpService.bank()
})
</script>

<template>
  <div class="flex mx-8 my-12 justify-center bg-white rounded-3xl pt-8 pb-36">
    <div class="w-full md:w-2/5">
      <h3>Account balances enquiry</h3>

      <div class="my-5">
        <TextInput
          label="Enter account number"
          :onChange="(v) => setState('accountNumber', v)"
          placeholder="Type here"
          type="text"
          class="mb-3 h-[70px]"
          :value="state?.accountNumber"
        />

        <SelectInput
          label="Select a bank"
          :onChange="submit"
          :selected="state?.bankCode"
          value="code"
          :name="['name']"
          placeholder="Choose"
          :items="banks ?? []"
        />
      </div>

      <div v-if="loading">
        <SpinnerComponent />
      </div>
      <div v-else>
        <div class="rounded bg-[#E7FFEF] py-4 px-5" v-if="accountInfo && accountBalance">
          <div class="pb-3">
            <p class="text-[#46A566] text-sm">Account name</p>
            <h3 class="text-[#204458] font-bold text-xl">
              {{ accountInfo?.otherNames }} {{ accountInfo?.surname }}
            </h3>
          </div>
          <div>
            <p class="text-[#46A566] text-sm">Account balance</p>
            <h3 class="text-[#204458] font-bold text-xl">&#8358;{{ balanceFormat }}</h3>
          </div>
        </div>
      </div>

      <div class="w-1/3 mt-5">
        <ButtonInput class="text-sm" bg="bg-[#46A566]" :onClick="view"> View All </ButtonInput>
      </div>
    </div>
  </div>
</template>
