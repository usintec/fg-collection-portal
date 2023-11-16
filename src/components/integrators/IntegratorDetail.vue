<script setup lang="ts">
import IntegratorHeader from './IntegratorHeader.vue'
import DetailInfo from '@/components/integrators/DetailInfo.vue'
import { usePageNameStore } from '@/stores/pageName'
import { watch, ref, onMounted } from 'vue'
import type { IIntegrator } from '@/services/types'
import IntegratorService from '@/services/IntegratorService'
import { useIntegratorStore } from '@/stores/integratorStore'
import UploadLogo from '../organizations/UploadLogo.vue'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const menuStore = usePageNameStore()
const showModal = ref(false)

const integrator = ref<IIntegrator>()
const intStore = useIntegratorStore()

onMounted(async () => {
  if (intStore?.activeIntegrator?.id) {
    const res = await IntegratorService.getOne(intStore.activeIntegrator.id)
    integrator.value = res
    menuStore.turnONSubMenu()
  }
})

watch(
  () => menuStore._goBack,
  () => {
    emit('back')
  }
)

watch(integrator, (org) => {
  state.value = org ?? {}
})

const state = ref<Partial<IIntegrator>>(integrator.value ?? {})
const loading = ref(false)
const errorMessage = ref<Partial<IIntegrator>>()

const setState = (key: keyof IIntegrator, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const close = () => {
  showModal.value = false
}
</script>
<template>
  <div class="mt-5 px-5">
    <IntegratorHeader
      :name="integrator?.name ?? ''"
      @saveChanges="console.log"
      @upload="() => (showModal = true)"
      :loading="loading"
    />
  </div>

  <div class="flex justify-center h-full">
    <DetailInfo
      :state="state"
      :errorMessage="errorMessage"
      class="w-full mx-3 rounded-t-lg mt-5"
      @setState="setState"
    />
  </div>

  <div>
    <UploadLogo :show="showModal" @closeModal="close" />
  </div>
</template>
