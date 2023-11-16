<script setup lang="ts">
import Breadcrumb from '../breadcrumb/Breadcrumb.vue'
import OrganizationList from '@/components/organizations/OrganizationList.vue'
import { ref, watch } from 'vue'
import { usePageNameStore } from '@/stores/pageName'
import SubOrgForm from '../sub-organization/SubOrgForm.vue'
import { useOrganizationStore } from '@/stores/organizationStore'

const showForm = ref(false)

const menuStore = usePageNameStore()
const orgStore = useOrganizationStore()

watch(
  () => menuStore._goBack,
  () => {
    showForm.value = false
    menuStore.setPageName('Sub Organization')
  }
)

const show = () => {
  showForm.value = true
  menuStore.setSubMenu('Create Sub Organization')
}
</script>

<template>
  <div class="pb-10">
    <div class="h-[68px] flex px-8 py-12 items-center justify-between">
      <Breadcrumb
        title="Create a new sub-organization"
        :name="orgStore.activeOrganization?.organizationName ?? ''"
      />
    </div>

    <div v-if="!showForm">
      <OrganizationList :show="show" :orgId="orgStore.activeOrganization?.organizationId" />
    </div>
    <SubOrgForm v-else />
  </div>
</template>
