<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import SelectInputVue from '@/components/inputs/select/SelectInput.vue'
import type { PriceAdjustmentModel } from '@/services/types'
import ButtonInput from '@/components/inputs/button/ButtonInput.vue'
import { Permissions } from '@/stores/permissionStore'

const props = defineProps<{
  item: Partial<PriceAdjustmentModel>
  loading: boolean
  errorMessage?: Partial<PriceAdjustmentModel>
}>()

const emit = defineEmits<{
  (e: 'change', v: Partial<PriceAdjustmentModel>): void
  (e: 'add'): void
}>()

const setState = (key: keyof PriceAdjustmentModel, v: any) => {
  const value = { ...props.item, [key]: v }
  emit('change', value)
}
</script>
<template>
  <div class="flex flex-col">
    <div class="text-dark_green font-medium m-1">Price Adjustment</div>
    <div
      class="bg-[#F6F8FF] text-sm text-dark_green h-16 flex gap-4 rounded-md justify-between items-center px-5"
    >
      <MaterialIcon icon="drag_indicator" class="text-[#A1AAC9] cursor-grab dragging-icon" />
      <div class="flex gap-4 flex-1 flex-3 h-11">
        <SelectInputVue
          :class="{
            'border border-red-600 focus:outline-red-500': errorMessage?.type,
            'focus:outline-green_regular': !errorMessage?.type
          }"
          whiteBg
          label=""
          :onChange="(v) => setState('type', v)"
          class="w-1/4 text"
          :items="[
            { id: 'Rebate', name: 'Rebate', permission: Permissions.RebateInvoice },
            { id: 'Increment', name: 'Increment', permission: Permissions.IncrementInvoice }
          ]"
          :name="['name']"
          noPadding
          :selected="item.type"
          value="id"
        />
        <TextInput
          placeholder="Description"
          whiteBg
          label=""
          :value="item.description"
          :onChange="(v) => setState('description', v)"
          class="w-1/2"
        />
        <TextInput
          :class="{
            'border border-red-600 focus:outline-red-500': errorMessage?.amount,
            'focus:outline-green_regular': !errorMessage?.amount
          }"
          placeholder="0.00"
          whiteBg
          :value="item.amount"
          label=""
          :onChange="(v) => setState('amount', v)"
          class="w-1/5"
        />
        <div class="w-32">
          <ButtonInput
            :loading="loading"
            class="w- text-xs text-[#204458] font-bold h-10 bg-[#DEEFFA] me-3"
            :onClick="() => emit('add')"
          >
            New Adjustment
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>
</template>
