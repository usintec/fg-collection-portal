<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '../modal/Modal.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import { useToast } from 'vue-toastification'
import OrganizationService from '@/services/OrganizationService'

const loading = ref(false)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFileUrl = ref<string | null>(null)
const toast = useToast()

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const active = ref(false)
const setActive = () => {
  active.value = true
}
const setInactive = () => {
  active.value = false
}

const openFile = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: any) => {
  const target = event.target as HTMLInputElement
  if (target?.files && target?.files[0]) {
    selectedFile.value = target.files[0]
    selectedFileUrl.value = URL.createObjectURL(target.files[0])
  }
}

const onDrop = (e: any) => {
  setInactive()
  selectedFile.value = e.dataTransfer.files[0]
  selectedFileUrl.value = URL.createObjectURL(e.dataTransfer.files[0])
}

const uploadFile = async () => {
  if (selectedFile.value === null) {
    return
  }
  loading.value = true
  const data = await OrganizationService.logoUpload(selectedFile.value)
  if (data.hasError) {
    loading.value = false
    toast.error(data.error)
  } else {
    loading.value = false
    selectedFileUrl.value = ''
    selectedFile.value = null
    toast.success('Image uploaded successfully')
    emit('closeModal')
  }
}

const imgSrc = computed(() => selectedFileUrl.value || '')
</script>
<template>
  <div>
    <Modal :shows="show" @closeModal="() => emit('closeModal')" title="Upload organization logo">
      <template v-slot:content>
        <div class="">
          <p class="text-[#626B8D] text-sm">
            Upload your organization’s logo. A rather more light-weight file would fit
          </p>

          <div
            class="my-8 border-2 border-dashed p-3 rounded-md"
            :data-active="active"
            @dragenter.prevent="setActive"
            @dragover.prevent="setActive"
            @dragleave.prevent="setInactive"
            @drop.prevent="onDrop"
          >
            <div class="flex items-center gap-9">
              <div
                class="w-1/4 bg-[#F6F8FF] flex justify-center items-center py-10 rounded"
                :class="['flex', 'items-center', 'gap-9', { 'py-5': selectedFileUrl }]"
              >
                <img
                  v-if="selectedFile"
                  :src="imgSrc"
                  alt="Selected Image"
                  class="w-28 h-28 object-cover rounded"
                />
                <MaterialIcon v-else class="text-5xl" icon="image" />
                <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput" />
              </div>
              <div>
                <p class="text-[#404764] text-base pb-3">Click to browse file or drag file here</p>

                <p
                  class="text-[#1192AE] text-sm font-medium hover:cursor-pointer"
                  @click="openFile"
                >
                  {{
                    selectedFile ? selectedFile.name : 'No file chosen yet. Click to browse file'
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <div class="w-1/4">
              <ButtonInput bg="bg-[#27536B]" :loading="loading" :onClick="uploadFile">
                Upload
              </ButtonInput>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
