<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Breadcrumb from '../breadcrumb/Breadcrumb.vue'
import dateFormat from 'dateformat'
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import Modal from '../modal/Modal.vue'
import { onMounted, ref } from 'vue'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { IAdminUser, ICreateAdmin } from '@/services/types'
import OrganizationService from '@/services/OrganizationService'
import type { IListColumn } from '../list/types'
import CheckBox from '../inputs/check/CheckBox.vue'
import { useToast } from 'vue-toastification'
import Badge from '../badge/Badge.vue'
import ListHolder from '../list/ListHolder.vue'
import { Permissions } from '@/stores/permissionStore'

const column: IListColumn<IAdminUser>[] = [
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
    name: 'First Name',
    isSortable: true,
    width: 200,
    dataFiled: 'firstName'
  },
  {
    id: 'lastName',
    name: 'Last Name',
    isSortable: true,
    width: 200,
    dataFiled: 'lastName'
  },
  {
    id: 'OrganizationName',
    name: 'Email',
    isSortable: true,
    width: 200,
    dataFiled: 'email'
  },
  {
    id: 'organizationEmail',
    name: 'First Name',
    isSortable: true,
    width: 200,
    dataFiled: 'firstName'
  },
  {
    id: 'status',
    name: 'Status',
    isSortable: true,
    width: 200,
    dataFiled: 'lastName',
    cell: true
  },
  {
    id: 'action',
    name: 'Action',
    isSortable: true,
    width: 200,
    dataFiled: 'id',
    cell: true
  }
]

const loading = ref(false)
const isModalVisible = ref(false)
const toast = useToast()

const orgStore = useOrganizationStore()
const adminData = ref<IAdminUser[]>([])

const pullData = async () => {
  const admins = await OrganizationService.getAdminUsers(
    orgStore.activeOrganization?.organizationId ?? ''
  )
  adminData.value = admins
}

onMounted(() => {
  pullData()
})

const modal = () => {
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
  pullData()
}
const isChecked = ref(false)
const state = ref<Partial<IAdminUser>>({
  role: 'admin'
})
const errorMessage = ref<Partial<IAdminUser>>({})

const setState = (key: keyof IAdminUser, value: string | boolean) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const setError = (key: keyof IAdminUser, v?: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: v }
}

const keys: (keyof IAdminUser)[] = ['firstName', 'lastName', 'email', 'role']

const itemErrorMessages = (keys: (keyof IAdminUser)[]) => {
  let error = false
  for (const key of keys) {
    if (!state.value[key]) {
      setError(key, `${key} is required`)
      error = true
    }
  }
  return error
}

const onCheck = () => {
  isChecked.value = !isChecked.value
}

const onSave = async () => {
  if (itemErrorMessages(keys)) {
    return
  }
  loading.value = true

  //create admin for the active organization
  const data: ICreateAdmin = {
    organizationId: orgStore.activeOrganization?.organizationId ?? '',
    adminUserModel: state.value
  }

  await OrganizationService.createAdminUser(data)
  toast.success('Admin created successfully')
  loading.value = false
  closeModal()
}
</script>

<template>
  <div class="pb-10">
    <div class="h-[68px] flex px-8 py-12 items-center justify-between">
      <Breadcrumb
        :title="orgStore?.organization?.organizationName ?? ''"
        :name="orgStore?.organization?.organizationCode ?? ''"
      />
    </div>

    <ListHolder
      title="Admin"
      :data="adminData"
      :columns="column"
      :pagination="true"
      :loading="loading"
      :onCreate="modal"
      :createPermission="[Permissions.CreateAdminUser]"
    >
      <template #status="{ id }">
        <Badge class="success">
          <template v-slot:content>
            <span @click="() => console.log(id)"> Active </span>
          </template>
        </Badge>
      </template>
      <template #action="{ id }">
        <div
          @click="console.log(id)"
          class="w-16 h-7 border pointer-cursor hover:scale-105 rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
        >
          View
        </div>
      </template>
      <template #createdAt="{ createdOn }">
        {{ dateFormat(createdOn, 'dd mmm, yyyy') }}
      </template>
    </ListHolder>

    <Modal :shows="isModalVisible" @closeModal="closeModal" title="Create new administrator">
      <template v-slot:content>
        <div class="grid grid-cols-2 mt-3">
          <div class="me-3">
            <TextInput
              label="First Name"
              placeholder="Ex. John"
              type="text"
              :onChange="(v) => setState('firstName', v)"
              important="*"
              :errorMessage="errorMessage?.firstName"
              :value="state?.firstName ?? ''"
            />
          </div>

          <div>
            <TextInput
              label="Last Name"
              placeholder="Ex. John"
              type="text"
              :onChange="(v) => setState('lastName', v)"
              important="*"
              :errorMessage="errorMessage?.lastName"
              :value="state?.lastName ?? ''"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 mt-3">
          <div class="me-3">
            <TextInput
              label="Email address"
              placeholder="Ex. user@organization.com"
              type="text"
              :onChange="(v) => setState('email', v)"
              important="*"
              :errorMessage="errorMessage?.email"
              :value="state?.email ?? ''"
            />
          </div>
          <SelectInput
            label="User Role"
            :onChange="(v) => setState('role', v)"
            important
            :errorMessage="errorMessage?.role"
            :selected="state?.role"
            value="name"
            disabled
            :name="['value']"
            :items="[{ name: 'admin', value: 'Admin' }]"
          />
        </div>

        <div
          :class="{
            'text-green-500': isChecked,
            'text-dark_green': !isChecked
          }"
          class="pt-3 flex gap-4 items-center"
        >
          <CheckBox :checked="isChecked" @onChecked="onCheck" :activeGreen="isChecked" />
          <span class="text-sm font-medium"> Force user change password </span>
        </div>

        <div class="flex justify-end">
          <div class="w-1/5">
            <ButtonInput :loading="loading" class="mt-9 w-[200px] text-[13px]" :onClick="onSave">
              Save
            </ButtonInput>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
