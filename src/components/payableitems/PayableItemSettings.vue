<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Breadcrumb from '../breadcrumb/Breadcrumb.vue'
import { useRouter } from 'vue-router'
import MaterialIcon from '../icon/MaterialIcon.vue'
import Toggle from '../inputs/toggle/Toggle.vue'
import { ref } from 'vue'

const router = useRouter()
const isActive = ref(false)

const cancel = () => {
  router.push('/payable-items')
}

const toggle = () => {
  isActive.value = !isActive.value
}
</script>

<template>
  <div class="pb-10">
    <div class="h-[68px] flex px-8 py-12 items-center justify-between">
      <Breadcrumb title="Service Item Settings" name="View payable item settings" />
      <div class="flex gap-4 justify-center items-center">
        <ButtonInput class="text-xs font-bold w-[125px] h-[46px] bg-[#204458]" :onClick="cancel">
          New Bill
        </ButtonInput>

        <ButtonInput class="text-xs font-bold w-[125px] h-[46px] btn-bg" :onClick="cancel">
          Go Back
        </ButtonInput>
      </div>
    </div>

    <div class="bg-white rounded-3xl py-12 px-8 mx-8">
      <div class="flex justify-between w-full pb-7">
        <div class="flex">
          <div
            class="w-[97px] h-[58px] bg-[#D8E9F2] rounded-[7px] flex justify-center items-center me-5"
          >
            <MaterialIcon icon="layers" class="text-[#9CBECF]" />
          </div>

          <div>
            <h5 class="text-base font-bold font-satoshi text-[#204458]">
              Service Payable Item [007865YC]

              <span
                class="rounded-[100px] bg-[#D9F8E3] text-center text-xs font-satoshi text-[#346444] p-1 px-2"
                >Enabled</span
              >
            </h5>
            <span class="text-sm font-normal text-[#6A789A] font-satoshi pe-2">
              NGN | GIFMIS: 987645389
            </span>
            <span class=""
              ><MaterialIcon icon="content_copy" class="text-sm text-[#137CDC]"
            /></span>
          </div>
        </div>

        <div class="text-right">
          <h3 class="text-2xl text-[#204458] font-bold font-satoshi">&#8358;250,000</h3>
          <p class="text-sm text-[#47526D] font-medium font-satoshi">VAT: 250,000</p>
        </div>
      </div>
      <hr />

      <div class="flex w-full px-1 font-satoshi py-5 justify-between">
        <div class="">
          <p class="text-sm font-medium not-italic pb-1 text-[#204458]">Partial Payment</p>

          <div class="w-[400px] h-auto rounded-[7px] bg-[#F6F9FF] px-4 py-4">
            <p class="text-[#6A789A] text-[13px] font-normal">
              Partial payment allows you to split payment item. If enabled partial payment will be
              allowed. If disabled exact amount will be required to be paid full during payment
            </p>

            <div class="mt-4">
              <Toggle :isActive="isActive" :onChange="toggle" />
              <span class="text-[13px] font-medium font-satoshi text-[#204458]">
                Partial Payment Disabled
              </span>
            </div>
          </div>
        </div>
        <div class="">
          <p class="text-sm font-medium not-italic pb-1 text-[#204458]">Due Date Reminders</p>

          <div class="w-[400px] h-auto rounded-[7px] bg-[#F6F9FF] px-4 py-4">
            <p class="text-[#6A789A] text-[13px] font-normal">
              Enable or Disable reminders for due dates. This allows reminders to be sent to
              customers who are paying for this item via email or SMS
            </p>

            <div class="mt-4">
              <Toggle :isActive="isActive" :onChange="toggle" />
              <span class="text-[13px] font-medium font-satoshi text-[#204458]">
                Remiders Enabled
              </span>
            </div>

            <div class="flex justify-between mt-4">
              <p class="text-[#6A789A] text-sm font-normal">Select platform</p>

              <div>
                <input type="checkbox" name="" id="" class="me-2" />
                <span class="pe-3 text-sm font-medium text-[#747EA1]">Email</span>

                <input type="checkbox" name="" id="" class="me-2" />
                <span class="text-sm font-medium text-[#747EA1]">SMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  </div>
</template>

<style>
.btn-bg {
  background-color: #cadfeb !important;
}
</style>
