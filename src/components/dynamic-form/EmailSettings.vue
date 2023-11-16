<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import type { InputElement } from './types'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { ref } from 'vue'
import SelectInput from '../inputs/select/SelectInput.vue'

const emit = defineEmits<{
  (e: 'change', v: Partial<InputElement>): void
  (e: 'remove', settingId: string): void
  (e: 'add'): void
}>()

const loading = ref(false)

const save = async () => {
  emit('add')
}

const removeAt = (index: any) => {
  if (paymentSettingsList.value.length > 1) {
    paymentSettingsList.value.splice(index, 1)
  }
}

const addNew = (index: number) => {
  paymentSettingsList.value.splice(index + 1, 0, { id: Date.now() })
}

const paymentSettingsList = ref([{ id: 1 }])
</script>
<template>
  <div class="flex flex-col w-full">
    <div class="flex justify-between items-center my-3">
      <div>
        <span class="bg-[#F3FFF9] p-2 rounded-md px-4 text-sm text-[#1E754C] me-3"
          >Provider Name: <strong>Google Workspace</strong></span
        >
      </div>

      <div class="w-[15%]">
        <ButtonInput
          class="text-sm !text-[#FF144D] h-11"
          :onClick="console.log"
          :bg="'bg-[#FFD0D6]'"
          :loading="loading"
        >
          Remove Provider
        </ButtonInput>
      </div>
    </div>

    <div
      class="text-sm text-dark_green h-28 flex gap-4 justify-between items-center px-1 border-b"
      v-for="(item, index) in paymentSettingsList"
      :key="index"
    >
      <SelectInput
        label="Record Type"
        :onChange="console.log"
        class="w-[10%] h-16"
        :items="[{}]"
        :name="['item']"
        noPadding
        value="item"
      />

      <TextInput
        placeholder="Host Key"
        label="Enter Key"
        :onChange="console.log"
        class="w-[25%] h-16"
      />

      <TextInput
        placeholder="Record Value"
        label="Enter Key"
        :onChange="console.log"
        class="w-[25%] h-16"
      />

      <SelectInput
        label="Time to live"
        :onChange="console.log"
        class="w-[10%] h-16"
        :items="[{}]"
        :name="['item']"
        noPadding
        value="item"
      />

      <div class="w-20 ml-5">
        <ButtonInput
          class="text-sm !text-[#204458] h-11 mt-5"
          :onClick="save"
          :bg="'bg-[#DEEFFA]'"
          :loading="loading"
        >
          Save
        </ButtonInput>
      </div>

      <div class="w-24">
        <ButtonInput
          class="text-sm !text-[#204458] h-11 mt-5"
          :onClick="() => addNew(index)"
          :bg="'bg-[#DEEFFA]'"
          :loading="loading"
        >
          Add Key
        </ButtonInput>
      </div>

      <MaterialIcon
        icon="delete"
        class="text-lg mt-5 hover:cursor-pointer"
        @click="removeAt(index)"
      />
    </div>
  </div>
</template>
