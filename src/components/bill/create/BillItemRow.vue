<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import PayableDynamicForm from '@/components/payableitems/PayableDynamicForm.vue'
import type { PayableItemModel } from '@/services/types'
import { usePayableItems } from '@/stores/payableItemStore'
import { computed, ref, watch } from 'vue'

const props = defineProps<PayableItemModel>()
defineEmits<{
  (e: 'remove'): void
}>()

const formatMoney = (value: number | string) => {
  const num = Number(value)
  return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const focus = ref(false)

const showCustomFiled = ref(false)

const store = usePayableItems()

const count = ref(store.getQuantity(props.payableItemId))

const dec = () => {
  if (count.value > 1) count.value--
}

const adjustCount = (e: Event) => {
  const target = e.target as HTMLInputElement
  const int = Number(target.value)
  count.value = int < 1 ? 1 : int
}

watch(count, () => {
  store.adjustQuantity(props.payableItemId, count.value)
})

const item = computed(() => {
  const item = store.items.find((item) => item.id === props.payableItemId)
  if (item) return item
  else return null
})

const total = computed(() => {
  const _item = item.value
  return ((_item?.price ?? 0) + (_item?.tax ?? 0)) * count.value
})

const adjustPrice = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = Number(target.value)
  store.adjustPrice(props.payableItemId, value)
}

const _currencyCode = (code: string) => {
  switch (code) {
    case 'NGN':
      return 8358
    case 'USD':
      return 36
    case 'EUR':
      return 8364
    case 'GBP':
      return 163
    default:
      return 1
  }
}
</script>
<template>
  <div class="grid-cols-11 grid font-bold text-sm border-b border-[#EAEFFC] py-3 items-center">
    <div class="col-span-3 2xl:col-span-4 flex flex-col text-dark_green">
      <span class="text-xs font-normal">GIFMIS: {{ gifmisCode }}&nbsp;&nbsp;Code: {{ code }}</span>
      <span class="font-medium text-base">
        {{ name }}
      </span>
      <span
        @click="() => (showCustomFiled = true)"
        v-if="Object.keys(additionalInformation ?? {}).length > 0"
        class="text-[#1162DC] text-xs cursor-pointer hover:underline font-medium"
      >
        Edit Custom Fields
      </span>
    </div>
    <span class="col-span-2">
      <div
        class="border border-[#E1E6F2] rounded-lg flex lg:justify-between w-10/12 px-3 py-3 text-sm font-medium"
      >
        <span v-if="priceRange.min" class="text-[#2F3A61]"
          ><input
            :type="focus ? 'number' : 'text'"
            :value="focus ? item?.price : formatMoney(item?.price ?? 0)"
            @focus="focus = true"
            @blur="focus = false"
            :min="priceRange.min"
            :max="priceRange.max"
            @change="adjustPrice"
            class="focus:outline-none w-11/12"
        /></span>
        <span v-else class="text-[#2F3A61]">{{ formatMoney(item?.price ?? 0) }}</span>
        <span class="text-[#959DB8]">{{ currencyCode }}</span>
      </div>
      <span class="font-thin pt-4 gap-y-2 gap-x-1 flex flex-wrap lg:flex-row" v-if="priceRange.min">
        <span>Min: {{ priceRange.min }}</span>
        <span>Max: {{ priceRange.max }}</span>
      </span>
    </span>
    <span class="col-span-2">
      <div
        class="border border-[#E1E6F2] rounded-lg flex lg:justify-between w-1/2 px-3 py-3 text-sm font-medium"
      >
        <span class="text-[#2F3A61]">{{ item?.tax }}</span>
        <span class="text-[#959DB8]">{{ currencyCode }}</span>
      </div>
      <span
        class="font-thin pt-4 text-transparent gap-y-2 gap-x-1 flex flex-wrap lg:flex-row"
        v-if="priceRange.min"
      >
        <span>Min: </span>
        <span>Max: </span>
      </span>
    </span>
    <span class="col-span-2 2xl:col-span-1"
      ><div
        class="border select-none border-[#E1E6F2] rounded-lg flex justify-between w-3/4 px-3 py-2 text-sm font-medium items-center"
      >
        <MaterialIcon
          @click="dec"
          icon="remove"
          class="text-[#959DB8] text-base mr-3 hover:text-dark_green cursor-pointer"
        />
        <input
          type="number"
          min="1"
          max="99"
          class="focus:outline-none"
          @focus="focus = true"
          @blur="focus = false"
          :value="count"
          @change="adjustCount"
        />
        <MaterialIcon
          @click="count++"
          icon="add"
          class="text-[#959DB8] text-base hover:text-dark_green cursor-pointer"
        />
      </div>
      <span
        class="font-thin pt-4 text-transparent gap-y-2 gap-x-1 flex flex-wrap lg:flex-row"
        v-if="priceRange.min"
      >
        <span>Min: </span>
        <span>Min: </span>
      </span></span
    >
    <span class="col-span-2">
      <div class="flex lg:flex-row flex-col text-dark_green font-bold px-4 justify-between">
        <span>{{ String.fromCharCode(_currencyCode(currencyCode)) }} {{ formatMoney(total) }}</span>
        <MaterialIcon
          @click="$emit('remove')"
          outline
          icon="delete"
          class="hover:scale-105 cursor-pointer"
        />
      </div>
      <span
        class="font-thin pt-4 text-transparent gap-y-2 gap-x-1 flex flex-wrap lg:flex-row"
        v-if="priceRange.min"
      >
        <span>Min: </span>
        <span>Min: </span>
      </span>
    </span>
  </div>
  <PayableDynamicForm
    :show="showCustomFiled"
    :form="additionalInformation"
    :id="payableItemId"
    @close="() => (showCustomFiled = false)"
  />
</template>
