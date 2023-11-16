<script setup lang="ts">
import Header from '@/components/header/Header.vue'
import DetailInfo from '@/components/detailinfo/DetailInfo.vue'
import { usePageNameStore } from '@/stores/pageName'
import { watch, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { IOrganization } from '@/services/types'
import OrganizationService from '@/services/OrganizationService'
import { useToast } from 'vue-toastification'
import { useOrganizationStore } from '@/stores/organizationStore'
import UploadLogo from './UploadLogo.vue'

const menuStore = usePageNameStore()
const router = useRouter()
const toast = useToast()
const showModal = ref(false)

const org = ref<IOrganization>()
const orgStore = useOrganizationStore()

onMounted(async () => {
  //get details of active organization
  if (orgStore?.activeOrganization?.organizationId) {
    const res = await OrganizationService.getOne(orgStore.activeOrganization.organizationId)
    org.value = res
    menuStore.turnONSubMenu()
  }
})

watch(
  () => menuStore._goBack,
  () => {
    router.push('/organizations')
    menuStore.setPageName('Organization')
    menuStore.setSubMenuId('')
  }
)

watch(org, (org) => {
  state.value = org ?? {}
})

const state = ref<Partial<IOrganization>>(org.value ?? {})
const loading = ref(false)
const errorMessage = ref<Partial<IOrganization>>()

const setState = (key: keyof IOrganization, value: string) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const setErrorMessage = (key: keyof IOrganization, message: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: message }
}

const checkForErrors = (): boolean => {
  let error = false
  const keys: (keyof IOrganization)[] = [
    'organizationName',
    'organizationCode',
    'organizationEmail',
    'organizationWebsite',
    'organizationPhoneNumber',
    'organizationContactPersonName',
    'organizationContactPersonEmail',
    'organizationContactPersonPhoneNumber',
    'organizationAddress',
    'organizationState',
    'organizationCity'
  ]

  for (const key of keys) {
    if (!state.value[key]) {
      setErrorMessage(key, `${key} is required`)
      error = true
    }
  }
  return error
}

const saveChanges = async () => {
  loading.value = true
  if (!checkForErrors()) {
    await OrganizationService.update(state.value)
    toast.success('Changes saved successfully')
  }
  loading.value = false
}

const close = () => {
  showModal.value = false
}
</script>
<template>
  <div class="mt-5 px-5">
    <Header
      :name="org?.organizationName ?? ''"
      @saveChanges="saveChanges"
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
