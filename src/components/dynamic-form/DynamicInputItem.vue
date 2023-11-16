<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import SelectInputVue from '@/components/inputs/select/SelectInput.vue'
import type { InputElement } from './types'
import { InputSelect, InputTypes } from './types'
import DynamicSelectOption from './DynamicSelectOption.vue'
import type { IErrorMessage } from './DynamicForm.vue'

const props = defineProps<{
  item: Partial<InputElement>
  errorMessage?: IErrorMessage
}>()

const emit = defineEmits<{
  (e: 'change', v: Partial<InputElement>): void
  (e: 'remove'): void
}>()

const setState = (key: keyof InputElement, v: any) => {
  const value = { ...props.item, [key]: v }
  emit('change', value)
}

const name = () => InputSelect.find((i) => i.id === props.item.type)?.name ?? ''
</script>
<template>
  <div class="flex flex-col">
    <div class="text-dark_green font-medium m-1">New Field ( {{ name() }} )</div>
    <div
      class="bg-[#F6F8FF] text-sm text-dark_green h-16 flex gap-4 rounded-md justify-between items-center px-5"
    >
      <MaterialIcon icon="drag_indicator" class="text-[#A1AAC9] cursor-grab dragging-icon" />
      <div class="flex gap-4 flex-1 flex-3 h-11">
        <SelectInputVue
          whiteBg
          label=""
          :onChange="(v) => setState('type', v)"
          class="w-1/3 text"
          :items="InputSelect"
          :name="['name']"
          noPadding
          :selected="item.type"
          value="id"
        />
        <TextInput
          placeholder="Field Title"
          whiteBg
          label=""
          :value="item.title"
          :onChange="(v) => setState('title', v)"
          class="w-1/3"
          :errorMessage="errorMessage?.errorMessage"
        />
        <TextInput
          v-if="item.type === InputTypes.TEXT"
          placeholder="Placeholder"
          whiteBg
          :value="item.placeholder"
          label=""
          :onChange="(v) => setState('placeholder', v)"
          class="w-1/3"
        />
        <TextInput
          v-else-if="item.type === InputTypes.DATE"
          placeholder="Placeholder"
          whiteBg
          label=""
          :onChange="(v) => setState('defaultValue', v)"
          class="w-1/3"
          :value="item.defaultValue"
          type="date"
        />
        <SelectInputVue
          v-else-if="item.type === InputTypes.DROPDOWN"
          whiteBg
          label=""
          :onChange="(v) => setState('defaultValue', v)"
          class="w-1/3 text"
          :items="item?.options ?? []"
          :name="['text']"
          :selected="item.defaultValue"
          noPadding
          value="name"
        />
      </div>
      <div
        @click="() => emit('remove')"
        class="flex rounded-full w-5 aspect-square justify-center items-center bg-[#ff3566] text-white text-sm cursor-pointer hover:scale-105"
      >
        <MaterialIcon icon="close" class="text-sm" />
      </div>
    </div>
    <DynamicSelectOption
      class="self-end mx-10"
      v-if="item.type === InputTypes.DROPDOWN"
      @change="(v) => setState('options', v)"
      :errorMessages="errorMessage?.options"
    />
  </div>
</template>
