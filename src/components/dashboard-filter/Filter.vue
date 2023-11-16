<script setup lang="ts">
import CurrencyInput from '../inputs/text/CurrencyInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import TextInput from '../inputs/text/TextInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { ref } from 'vue'
import { FilterMethod, type IFilterReport } from '@/services/types'

const filterData = ref([
  { id: '1', duration: FilterMethod.Today },
  { id: '2', duration: FilterMethod.ThisWeek },
  { id: '3', duration: FilterMethod.Last30Days },
  { id: '4', duration: FilterMethod.ThisMonth },
  { id: '5', duration: FilterMethod.Last90Days },
  { id: '6', duration: FilterMethod.ThisYear },
  { id: '7', duration: FilterMethod.CustomDate }
])
const props = defineProps<{
  loading?: boolean
}>()
const emit = defineEmits<{
  (e: 'apply', value: IFilterReport): void
}>()
const showDate = ref(false)
const savedSetting = ref<{ name: string; image: string }>()
const state = ref<Partial<IFilterReport>>({})
const errorMessage = ref<Partial<IFilterReport>>()
const setState = (key: keyof IFilterReport, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
</script>
<template>
  <div class="flex justify-end gap-3 p-3 px-8">
    <CurrencyInput
      label=""
      :onChange="(v) => setState('currency', v)"
      :selectItem="(v) => setState('currency', v)"
      :errorMessage="errorMessage?.currency"
      :value="state.currency"
      :item="savedSetting"
      placeholder="Naira (NGN)"
      type="text"
      class="w-40"
      bg="bg-blue-100"
      readonly
    />
    <div class="me-3">
      <SelectInput
        label=""
        :placeholder="FilterMethod.Last30Days"
        :onChange="
          (v) => {
            if (v == FilterMethod.CustomDate) showDate = true
            else showDate = false
            setState('duration', v)
          }
        "
        :selected="state?.duration"
        value="duration"
        :errorMessage="errorMessage?.duration"
        :name="['duration']"
        :items="filterData"
        bg="bg-blue-100"
        class="w-36"
      />
    </div>
    <div class="flex">
      <TextInput
        v-if="showDate"
        label=""
        placeholder="From Date"
        type="datetime-local"
        :onChange="(v) => setState('startDate', v)"
        class="w-40 me-3"
        :whiteBackground="true"
        :errorMessage="errorMessage?.startDate"
        :value="state?.startDate"
      />
      <TextInput
        v-if="showDate"
        label=""
        placeholder="To Date"
        type="datetime-local"
        :onChange="(v) => setState('endDate', v)"
        class="w-40 me-3"
        :whiteBackground="true"
        :errorMessage="errorMessage?.endDate"
        :value="state?.endDate"
      />
      <ButtonInput
        :loading="props.loading"
        bg="bg-[#3DBA67]"
        class="!w-20 !text-dark_green"
        :onClick="() => emit('apply', state)"
      >
        <span class="text-white">Apply</span>
      </ButtonInput>
    </div>
  </div>
</template>
