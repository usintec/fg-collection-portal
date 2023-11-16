<script setup lang="ts" generic="T extends Record<string, any>">
import { ref } from 'vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import SpinnerComponent from '../loader/SpinnerComponent.vue'
import type { RootAPIResponse } from '@/services/types'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  api: (file: File) => Promise<RootAPIResponse<T[]>>
}>()

const emit = defineEmits<{
  (e: 'downloadTemplate'): void
  (e: 'closeModal'): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const loading = ref(false)
const toast = useToast()

const active = ref(false)

const setActive = () => {
  active.value = true
}
const setInactive = () => {
  active.value = false
}

const openFileDialog = () => {
  fileInput.value?.click()
}

const onDrop = (e: any) => {
  setInactive() // add this line too
  file.value = e.dataTransfer.files[0]
}

const onFileChange = (e: any) => {
  file.value = e.target.files[0]
}

const onSubmit = async () => {
  if (file.value === null) {
    return
  }
  loading.value = true
  const res = await props.api(file.value)
  if (res.hasError) {
    loading.value = false
    toast.error(res.error)
  } else {
    loading.value = false
    toast.success(res.value.length + ' records uploaded successfully')
    emit('closeModal')
  }
}
</script>
<template>
  <div class="p-9 flex flex-col gap-5 w-full">
    <span class="text-[#626B8D] text-sm font-normal"
      >Download<span
        @click="$emit('downloadTemplate')"
        class="text-[#0B6CFE] font-bold cursor-pointer hover:underline hover:scale-110"
      >
        Sample CSV Template</span
      >
      to understand how to define MDA data for upload</span
    >

    <ul class="text-[#3B7A73] text-sm font-normal list-disc mx-8 my-4">
      <li>Open the sample template file with your favorite excel editor</li>
      <li>Fill in the services data as described in the template</li>
      <li>Columns marked with asterisks are mandatory</li>
      <li>Save file and upload below</li>
    </ul>
    <div
      class="border border-dashed border-[#8F9CBD] bg-white px-2.5 py-2 mb-7"
      :data-active="active"
      @dragenter.prevent="setActive"
      @dragover.prevent="setActive"
      @dragleave.prevent="setInactive"
      @drop.prevent="onDrop"
    >
      <div class="bg-[#F6F8FF] w-full flex justify-center items-center h-36">
        <SpinnerComponent v-if="loading" />
        <div v-else class="flex flex-col gap-1 text-center">
          <div
            @click="openFileDialog"
            class="text-[#626B8D] cursor-pointer hover:underline hover:scale-110 text-sm font-normal"
          >
            Click to browse file or drag file here
          </div>
          <div
            @click="openFileDialog"
            class="text-[#1192AE] cursor-pointer hover:underline hover:scale-110 text-sm font-medium"
          >
            {{ file ? file.name : 'No file chosen yet' }}
          </div>
          <input @change="onFileChange" class="opacity-0 w-0" type="file" ref="fileInput" />
        </div>
      </div>
    </div>

    <div class="flex w-full p-1 flex-row-reverse">
      <div class="w-1/4">
        <ButtonInput :onClick="onSubmit">Upload</ButtonInput>
      </div>
    </div>
  </div>
</template>
