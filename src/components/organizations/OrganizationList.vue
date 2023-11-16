<script setup lang="ts">
import dateFormat from 'dateformat'
import type { IListColumn } from '@/components/list/types'
import type { IOrganization } from '@/services/types'
import Badge from '@/components/badge/Badge.vue'
import { onMounted, ref } from 'vue'
import OrganizationService from '@/services/OrganizationService'
import { useRouter } from 'vue-router'
import { usePageNameStore } from '@/stores/pageName'
import { useOrganizationStore } from '@/stores/organizationStore'
import ListHolder from '../list/ListHolder.vue'
import { Permissions } from '@/stores/permissionStore'

const props = defineProps<{
  orgId?: string
  show: () => void
}>()
const orgStore = useOrganizationStore()
const column: IListColumn<IOrganization>[] = [
  {
    id: 'createdAt',
    name: 'Created on',
    isSortable: true,
    dataFiled: 'createdOn',
    width: 200,
    cell: true
  },
  {
    id: 'code',
    name: 'Organization Code',
    isSortable: true,
    width: 200,
    dataFiled: 'organizationCode'
  },
  {
    id: 'OrganizationName',
    name: 'Organization Name',
    isSortable: true,
    width: 200,
    dataFiled: 'organizationName'
  },
  {
    id: 'organizationEmail',
    name: 'Organization Email',
    isSortable: true,
    width: 200,
    dataFiled: 'organizationEmail'
  },
  {
    id: 'status',
    name: 'Status',
    isSortable: true,
    width: 200,
    dataFiled: 'organizationStatus',
    cell: true
  },
  {
    id: 'action',
    name: 'Action',
    isSortable: true,
    width: 200,
    dataFiled: 'organizationStatus',
    cell: true
  }
]

const data = ref<IOrganization[]>([])
const loading = ref(true)

const pageName = usePageNameStore()

const router = useRouter()

const goDetail = (id: string) => {
  //get selected organization
  const selectedOrganization = data.value.find((organization) => organization.organizationId == id)
  //add the selected organization to the stack
  orgStore.addToOrganizationStack(selectedOrganization)
  //make the selected organization active
  orgStore.setActiveOrganization(selectedOrganization)
  pageName.setSubMenu('Organization Detail')
  router.push(`/organizations`)
  pageName.setPageName('Details')
}

onMounted(async () => {
  if (props.orgId) data.value = await OrganizationService.getAllSubOrganizations(props.orgId)
  loading.value = false
})
</script>
<template>
  <div>
    <ListHolder
      title="Organizations"
      :data="data"
      :columns="column"
      :pagination="true"
      :loading="loading"
      :onCreate="show"
      :create-permission="[Permissions.CreateOrganization]"
    >
      <template #status="{ id }">
        <Badge class="success">
          <template v-slot:content> <span @click="() => console.log(id)"> Active </span> </template>
        </Badge>
      </template>
      <template #action="{ organizationId }">
        <div
          @click="goDetail(organizationId)"
          class="w-16 h-7 border pointer-cursor hover:scale-105 rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
        >
          View
        </div>
      </template>
      <template #createdAt="{ createdOn }">
        {{ dateFormat(createdOn, 'dd mmm, yyyy') }}
      </template>
    </ListHolder>
  </div>
</template>
