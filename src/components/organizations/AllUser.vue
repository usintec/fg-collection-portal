<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import dateFormat from 'dateformat'
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import ListHolder from '../list/ListHolder.vue'
import Modal from '../modal/Modal.vue'
import { onMounted, ref, computed, watch, reactive } from 'vue'
import { useOrganizationStore } from '@/stores/organizationStore'
import type { IAdminUser, ICreateAdmin, IRole } from '@/services/types'
import OrganizationService from '@/services/OrganizationService'
import RoleService from '@/services/RoleService'
import UserService from '@/services/UserService'
import type { IListColumn } from '../list/types'
import CheckBox from '../inputs/check/CheckBox.vue'
import { useToast } from 'vue-toastification'
import Badge from '../badge/Badge.vue'
import { usePageNameStore } from '@/stores/pageName'
import { useRoleStore } from '@/stores/roleStore'
import EditUser from './EditUser.vue'
import type { IPermission } from '@/services/types'
import SetUserPermissions from './SetUserPermissions.vue'
import PermissionService from '@/services/PermissionService'
import SpinnerComponent from '../loader/SpinnerComponent.vue'
import Accordion from '../accordion/Accordion.vue'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

const menuStore = usePageNameStore()
const roleStore = useRoleStore()
const role = computed(() => roleStore.role || [])

const states = reactive({
  roleInfo: ref<IRole | undefined>(),
  permission: ref<IPermission | null>(null),
  getPermission: ref<IPermission | null>(null),
  rolePermission: ref<IPermission | null>(null),
  orgStore: useOrganizationStore(),
  adminData: ref<IAdminUser[]>([]),
  selectedUser: ref<IAdminUser | null>(null),
  userInput: ref<Partial<IAdminUser>>({}),
  permit: ref<IPermission[]>([]),
  toast: useToast(),
  isCheckeds: ref<Record<string, boolean>>({}),
  userId: '',
  loading: false,
  loadings: false,
  isModalVisible: false,
  editUser: false,
  showPermission: false,
  org: '',
  selectedRole: '',
  showDiv: false
})

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
    name: 'Email',
    isSortable: true,
    width: 200,
    dataFiled: 'email'
  },
  {
    id: 'code',
    name: 'Name',
    isSortable: true,
    width: 200,
    dataFiled: 'firstName'
  },
  {
    id: 'code',
    name: 'Username',
    isSortable: true,
    width: 200,
    dataFiled: 'username'
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
    cell: true,
    permissions: [
      Permissions.AddUserRole,
      Permissions.AddUserPermission,
      Permissions.UpdateUserPermission
    ]
  }
]

const updateUserInput = () => {
  states.userInput = {
    firstName: state.value.firstName,
    lastName: state.value.lastName,
    email: state.value.email,
    roleId: state.value.roleId,
    permissions: state.value.permissions
  }
}

const selectUser = async (id: any) => {
  const user = states.adminData.find((user) => user.id === id)
  states.selectedUser = user || null

  states.editUser = true

  const permissionData = await UserService.getUserPermissions(id)
  states.getPermission = permissionData

  const getOne = await RoleService.getOne(states.selectedUser?.role || '')
  states.roleInfo = getOne

  const permissionDatas = await PermissionService.getPermissions(states.selectedUser?.role || '')
  states.rolePermission = permissionDatas

  states.userId = id
}

const closeUser = () => {
  states.editUser = false
  pullData()
}

const close = () => {
  states.showPermission = false
}

const modal = () => {
  states.isModalVisible = true
}

const closeModal = () => {
  states.isModalVisible = false
  pullData()
}

const state = ref<Partial<IAdminUser>>({})
const errorMessage = ref<Partial<IAdminUser>>({})

const setState = (key: keyof IAdminUser, value: string | boolean) => {
  state.value = { ...state.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }

  updateUserInput()
}

const setError = (key: keyof IAdminUser, v?: string) => {
  errorMessage.value = { ...errorMessage.value, [key]: v }
}

const keys: (keyof IAdminUser)[] = ['firstName', 'lastName', 'email', 'roleId']

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

const groupedPermissions = computed(() => {
  const grouped: Record<string, IPermission[]> = {}
  states.permit.forEach((permission) => {
    if (!grouped[permission.group]) {
      grouped[permission.group] = []
    }
    grouped[permission.group].push(permission)
  })
  return grouped
})

const checkedGroups = computed(() => {
  const result: Record<string, Array<IPermission>> = {}
  for (const groupName in groupedPermissions.value) {
    const permissions = groupedPermissions.value[groupName]
    const checkedPermissions = permissions.filter(
      (permission) => states.isCheckeds[permission.code]
    )
    if (checkedPermissions.length > 0) {
      result[groupName] = checkedPermissions
    }
  }
  return result
})

const isRoleSelected = computed(() => !!states.selectedRole)

const handleRoleChange = async (value: any) => {
  setState('roleId', value)
  updateUserInput()
  states.selectedRole = value
  states.showDiv = true

  states.loadings = true
  const permissionData = await PermissionService.getPermissions(value)
  states.permission = permissionData

  states.loadings = false
}

const isPermissionAvailable = (code: any) => {
  if (!states.permission) {
    return false
  }

  const permitValues = Object.values(states.permission).flatMap((group) => group)

  for (const permission of permitValues) {
    if (typeof permission === 'object' && permission && (permission as any).code === code) {
      return true
    }
  }
}

const onChecks = (code: string) => {
  if (!isPermissionAvailable(code)) {
    states.isCheckeds = {
      ...states.isCheckeds,
      [code]: !states.isCheckeds[code]
    }
  }
}

const showPermit = () => {
  if (itemErrorMessages(keys)) {
    return
  }
  states.showPermission = true
}

const toggleDivVisibility = () => {
  states.showDiv = !states.showDiv
}

const onSave = async () => {
  if (itemErrorMessages(keys)) {
    return
  }
  states.loading = true

  state.value.permissions = Object.keys(states.isCheckeds).filter((code) => states.isCheckeds[code])
  const adminDatas: ICreateAdmin = {
    organizationId: states.orgStore.activeOrganization?.organizationId ?? '',
    adminUserModel: state.value
  }

  await OrganizationService.createAdminUser(adminDatas)
  states.toast.success('User created successfully')
  state.value = {}
  states.loading = false
  pullData()
  closeModal()
}

const pullData = async () => {
  states.loading = true

  const admins = await OrganizationService.getAdminUsers(
    states.orgStore.activeOrganization?.organizationId ?? ''
  )
  states.adminData = admins

  const data = await RoleService.getAll()
  roleStore.setRole(data)

  const datas = await PermissionService.getAll()
  states.permit = datas

  states.loading = false

  states.org = states.orgStore.activeOrganization?.organizationId ?? ''
}

onMounted(() => {
  menuStore.setPageName('User Management')
  pullData()
})

watch(
  () => states.permission,
  (newPermits) => {
    states.isCheckeds = {}

    if (newPermits) {
      if (Array.isArray(newPermits)) {
        newPermits.forEach((permission) => {
          if (permission && typeof permission === 'object') {
            const code = permission.code
            states.isCheckeds[code] = true
          }
        })
      } else if (typeof newPermits === 'object') {
        Object.values(newPermits).forEach((group) => {
          if (Array.isArray(group)) {
            group.forEach((permission) => {
              if (permission && typeof permission === 'object') {
                const code = permission.code
                states.isCheckeds[code] = true
              }
            })
          }
        })
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="pb-10">
    <ListHolder
      :onCreate="modal"
      title="Users"
      searchTitle="Search Users"
      :data="states.adminData"
      :columns="column"
      :pagination="true"
      :loading="states.loading"
      :createPermission="[Permissions.SetupUsers]"
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
          @click="() => selectUser(id)"
          class="w-16 h-7 border pointer-cursor hover:scale-105 rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
        >
          Edit Role
        </div>
      </template>
      <template #createdAt="{ createdOn }">
        {{ dateFormat(createdOn, 'dd mmm, yyyy') }}
      </template>
    </ListHolder>

    <Modal
      :shows="states.isModalVisible"
      @closeModal="closeModal"
      title="Create new user"
      width="w-11/12 lg:w-1/2 xl:w-5/12 2xl:w-1/4"
    >
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

        <div class="grid grid-cols mt-3">
          <div class="mb-3">
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
            :onChange="handleRoleChange"
            @click="toggleDivVisibility"
            important
            :errorMessage="errorMessage?.roleId"
            :selected="state?.roleId ?? ''"
            value="id"
            :name="['displayName']"
            :items="role"
            placeholder="Choose"
          />
        </div>

        <div class="mt-5 flex justify-center items-center" v-if="states.loadings">
          <SpinnerComponent />
        </div>
        <div v-else-if="isRoleSelected">
          <div
            class="py-4 mt-4 bg-[#FFD0D6] rounded"
            v-if="Object.keys(checkedGroups).length === 0"
          >
            <p class="text-center font-medium text-[#204458]">No permission assigned</p>
          </div>

          <Accordion
            class="mx-1 overflow-hidden transition-all duration-300"
            :items="checkedGroups"
            :class="{
              'max-h-[550px] my-5': !states.showDiv,
              'max-h-0': states.showDiv,
              'opacity-100': !states.showDiv,
              'opacity-0': states.showDiv
            }"
          >
            <template v-slot:header="{ index }">
              <h3>{{ index }}</h3>
            </template>
            <template v-slot="{ item }">
              <div class="mb-7">
                <div class="grid grid-cols-2 md:grid-cols-2">
                  <div
                    class="flex items-center mt-3 gap-3"
                    v-for="permission in item"
                    :key="permission.code"
                  >
                    <CheckBox
                      :checked="states.isCheckeds[permission.code]"
                      :activeGreen="states.isCheckeds[permission.code]"
                      @onChecked="onChecks(permission.code)"
                      :disabled="isPermissionAvailable(permission.code)"
                    />

                    <p class="text-sm">{{ permission.description }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Accordion>
        </div>

        <CheckPermission :permission="Permissions.AddUserPermission">
          <div class="my-3">
            <span class="text-[#D36C31] text-sm hover:cursor-pointer" @click="showPermit"
              >Set Permissions instead</span
            >
          </div>
        </CheckPermission>
        <!-- <div
          :class="{
            'text-green-500': isChecked,
            'text-dark_green': !isChecked
          }"
          class="pt-3 flex gap-4 items-center"
        >
          <CheckBox :checked="isChecked" @onChecked="onCheck" :activeGreen="isChecked" />
          <span class="text-sm font-medium"> Force user change password </span>
        </div> -->

        <div class="flex justify-end">
          <div class="w-[150px]">
            <ButtonInput :loading="states.loading" class="mt-9 text-[13px]" :onClick="onSave">
              Submit
            </ButtonInput>
          </div>
        </div>
      </template>
    </Modal>

    <SetUserPermissions
      :show="states.showPermission"
      @closeModal="close"
      :permits="states.permission"
      :org="states.org"
      :userInput="states.userInput"
      @closeModals="closeModal"
    />

    <EditUser
      :show="states.editUser"
      @closeModal="closeUser"
      :permits="states.getPermission"
      :name="states.selectedUser"
      :roleInfo="states.roleInfo"
      :userId="states.userId"
      :rolePermits="states.rolePermission"
    />
  </div>
</template>
