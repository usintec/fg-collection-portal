<script setup lang="ts">
import Modal from '../modal/Modal.vue'
import TextInput from '../inputs/text/TextInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { ref } from 'vue'

interface IProvider {
  name: string
}
defineProps<{
  show: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
  (v: 'addProvider', name: string): void
}>()
const state = ref<Partial<IProvider>>({ name: '' })
const validationFields: (keyof IProvider)[] = ['name']
const errorMessage = ref<Partial<IProvider>>()
const setState = (key: keyof IProvider, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}
const setErrorMessage = (key: keyof IProvider, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}
const errorMessages = (keys: (keyof IProvider)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}
const save = () => {
  if (errorMessages(validationFields)) return
  emit('addProvider', state.value.name ?? '')
}
</script>

<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      title="Add a new settlement provider"
      width="w-11/12 lg:w-1/2 xl:w-5/12 2xl:w-1/4"
    >
      <template v-slot:content>
        <div class="mt-5">
          <div class="mb-5 flex justify-between gap-5">
            <TextInput
              label="Provide name"
              :onChange="(v) => setState('name', v)"
              placeholder="Ex. Flutterwave"
              type="text"
              class="mb-3 w-full"
              :value="state?.name?.toString()"
              :errorMessage="errorMessage?.name?.toString()"
            />
          </div>
          <div class="flex items-center text-dark_green justify-end">
            <div class="w-2/5">
              <ButtonInput class="text-sm bg-[#D8E8F2]" :onClick="save" :loading="loading">
                Add Provider
              </ButtonInput>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
