<script setup lang="ts">
import { ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import DynamicInputItem from './DynamicInputItem.vue'
import { InputTypes, type InputElement } from './types'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'

interface Props {
  title: string
  width?: string
  submitData?: boolean
}

export interface IErrorMessage {
  errorMessage?: string
  options?: {
    value?: string
    text?: string
  }[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit', data: Record<string, Partial<InputElement>>): void
}>()

const form = ref<Partial<InputElement>[]>([])

const setForm = (v: Partial<InputElement>, i: number) => {
  form.value[i] = v
}

const radomStr = () => `${Math.random()}`.slice(2)

const addNewFiled = () => {
  form.value.push({ type: InputTypes.TEXT, id: radomStr() })
}

const removeAt = (index: number) => {
  form.value = form.value.filter((_, i) => i !== index)
}

const errorMessage = ref<Partial<IErrorMessage>[]>([])

const calculateError = () => {
  let error = false
  const errors: Partial<IErrorMessage>[] = []

  for (const formItem of form.value) {
    const errorMessages: Partial<IErrorMessage> = {}

    if (!formItem.title) {
      errorMessages['errorMessage'] = 'title is required'
      error = true
    }

    if (formItem.type === InputTypes.DROPDOWN) {
      const optionsErrors =
        formItem.options?.map((option) => ({
          value: option.value ? undefined : 'value is required',
          text: option.text ? undefined : 'text is required'
        })) ?? []

      errorMessages['options'] = optionsErrors.filter((o) => o.text || o.value)
      error = errorMessages['options'].length > 0
    }
    errors.push(errorMessages)
  }
  errorMessage.value = errors
  return error
}

const submit = () => {
  if (!calculateError()) {
    const data: Record<string, Partial<InputElement>> = {}
    for (const _form of form.value) {
      data[_form.id!] = _form
    }
    emit('submit', data)
  }
}

watch(() => props.submitData, submit)
</script>
<template>
  <div class="w-full flex-col flex p-4 bg-white pb-20">
    <div class="w-full justify-between flex">
      <div class="text-[#8E95AF] text-sm font-medium">{{ title }}</div>
      <div v-if="form.length && submitData === undefined" class="w-52">
        <ButtonInput class="text-base font-bold h-[46px] bg-[#204458] me-3" :onClick="submit"
          >Save
        </ButtonInput>
      </div>
    </div>
    <VueDraggable
      ref="div"
      class="w-full flex flex-col justify-end items-end gap-4"
      v-model="form"
      :animation="150"
      bubbleScroll
      ghostClass="opacity-10"
      handle=".dragging-icon"
    >
      <DynamicInputItem
        :class="width ?? 'w-2/3'"
        v-for="(item, i) in form"
        :key="item.id"
        :item="item"
        :errorMessage="errorMessage[i]"
        @remove="() => removeAt(i)"
        @change="(v) => setForm(v, i)"
      />
    </VueDraggable>
    <div
      @click="addNewFiled"
      class="w-12 h-12 cursor-pointer hover:scale-105 rounded-full ml-auto mt-5 flex items-center justify-center !bg-[#D8E8F2] text-dark_green me-3"
    >
      <MaterialIcon icon="add" />
    </div>
  </div>
</template>
