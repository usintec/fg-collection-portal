<script setup lang="ts">
import Modal from '../modal/Modal.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import TextInput from '../inputs/text/TextInput.vue'
import CheckBox from '../inputs/check/CheckBox.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { ref, onMounted, computed, watch } from 'vue'
import type { IPermission, IRole, IAdminUser, IEditAdminUser } from '@/services/types'
import PermissionService from '@/services/PermissionService'
import RoleService from '@/services/RoleService'
import { useToast } from 'vue-toastification'
import { useRoleStore } from '@/stores/roleStore'
import { getRandomCharacter } from './randomCharacter'
import UserService from '@/services/UserService'
import Accordion from '../accordion/Accordion.vue'

const toast = useToast()
const permit = ref<IPermission[]>([])
const isChecked = ref<Record<string, boolean>>({})
const loading = ref(false)
const roleStore = useRoleStore()
const searchTerm = ref('')
const roles = computed(() => roleStore.role || [])

interface IPermits {
  permits?: { code: string; group: string; description: string } | null
  show: boolean
  name: { firstName: string; lastName: string; roleId: string } | null
  roleId?: string
  roleInfo: IRole | undefined
  userId: string
  rolePermits?: { code: string; group: string; description: string } | null
}

const props = defineProps<IPermits>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()

const groupedPermissions = computed(() => {
  const grouped: Record<string, IPermission[]> = {}
  permit.value.forEach((permission) => {
    if (!grouped[permission.group]) {
      grouped[permission.group] = []
    }
    grouped[permission.group].push(permission)
  })
  return grouped
})

const user = ref<Partial<IAdminUser>>({})
const errorMessage = ref<Partial<IRole>>()
const permitState = ref<IPermission>({} as IPermission)
const edit = ref<Partial<IEditAdminUser>>({})

const setState = (key: keyof IEditAdminUser, value: string | boolean) => {
  edit.value = { ...edit.value, [key]: value }
  errorMessage.value = { ...errorMessage.value, [key]: undefined }
}

const randomValue = getRandomCharacter()

const submit = async () => {
  loading.value = true
  edit.value.permissions = Object.keys(isChecked.value).filter((code) => isChecked.value[code])
  edit.value.uniqueRequestId = randomValue
  try {
    await UserService.update(`${props.userId}`, edit.value)

    const data = await RoleService.getAll()
    roleStore.setRole(data)

    toast.success('Updated successfully')
    loading.value = false

    permitState.value = {} as IPermission
    emit('closeModal')
  } catch (error) {
    loading.value = false
  }
}

const pull = async () => {
  loading.value = true
  const data = await PermissionService.getAll()
  permit.value = data
  loading.value = false

  isChecked.value = {}
}

onMounted(() => {
  pull()
})

const isPermissionAvailable = (code: any) => {
  if (!props.rolePermits) {
    return false
  }
  const permitValues = Object.values(props.rolePermits).flatMap((group) => group)

  for (const permission of permitValues) {
    if (typeof permission === 'object' && permission && (permission as any).code === code) {
      return true
    }
  }
}

const onCheck = (code: string) => {
  if (!isPermissionAvailable(code)) {
    isChecked.value = {
      ...isChecked.value,
      [code]: !isChecked.value[code]
    }
  }
}

const filteredPermissions = computed(() => {
  const filtered: Record<string, IPermission[]> = {}
  for (const groupName in groupedPermissions.value) {
    const permissions = groupedPermissions.value[groupName].filter((permission) => {
      return permission.group.toLowerCase().includes(searchTerm.value.toLowerCase())
    })
    if (permissions.length > 0) {
      filtered[groupName] = permissions
    }
  }
  return filtered
})

const onFilter = (event: any) => {
  searchTerm.value = event.target.value
}

watch(
  [() => props.permits, () => props.rolePermits],
  ([newPermits, newRolePermits]) => {
    isChecked.value = {}

    if (newPermits) {
      if (Array.isArray(newPermits)) {
        newPermits.forEach((permission) => {
          if (permission && typeof permission === 'object') {
            const code = permission.name
            isChecked.value[code] = true
          }
        })
      } else if (typeof newPermits === 'object') {
        Object.values(newPermits).forEach((group) => {
          if (Array.isArray(group)) {
            group.forEach((permission) => {
              if (permission && typeof permission === 'object') {
                const code = permission.code
                isChecked.value[code] = true
              }
            })
          }
        })
      }
    }

    if (newRolePermits) {
      if (Array.isArray(newRolePermits)) {
        newRolePermits.forEach((permission) => {
          if (permission && typeof permission === 'object') {
            const code = permission.name
            isChecked.value[code] = true
          }
        })
      } else if (typeof newRolePermits === 'object') {
        Object.values(newRolePermits).forEach((group) => {
          if (Array.isArray(group)) {
            group.forEach((permission) => {
              if (permission && typeof permission === 'object') {
                const code = permission.code
                isChecked.value[code] = true
              }
            })
          }
        })
      }
    }
  },
  { immediate: true }
)

watch(
  () => props.name,
  (newName) => {
    user.value = {
      firstName: newName?.firstName,
      lastName: newName?.lastName,
      roleId: newName?.roleId
    }
  },
  { immediate: true }
)

watch(
  () => props.roleInfo,
  (newName) => {
    edit.value = {
      roleId: newName?.id,
      displayName: newName?.displayName
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      title="Edit role and permissions"
      width="w-11/12 lg:w-1/2 xl:w-5/12 2xl:w-1/4"
    >
      <template v-slot:content>
        <div class="my-5">
          <p class="text-sm">
            Editing role for:
            <span class="text-[#204458] font-semibold"
              >{{ user?.firstName }} {{ user?.lastName }}</span
            >
          </p>
        </div>
        <div class="mt-5">
          <div class="mb-5">
            <SelectInput
              label="Select Role"
              :onChange="(v) => setState('roleId', v)"
              :selected="edit?.roleId ?? ''"
              important
              value="id"
              :name="['displayName']"
              :items="roles"
            />
          </div>

          <div class="flex justify-between mt-5 mb-5 pb-5 border-b">
            <p class="text-sm">View Role Permissions below.</p>

            <p class="text-sm">Scroll to see more</p>
          </div>

          <div class="mb-9">
            <TextInput
              label="Search Role"
              :onChange="console.log"
              @input="onFilter"
              placeholder="Ex. Role Name"
              type="text"
              class="mb-3 h-[70px]"
            />
          </div>

          <div
            class="py-5 bg-[#FFD0D6] rounded"
            v-if="Object.keys(filteredPermissions).length === 0"
          >
            <p class="text-center font-medium text-[#204458]">Role Not Found!</p>
          </div>

          <Accordion :items="filteredPermissions">
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
                      :checked="isChecked[permission.code]"
                      :activeGreen="isChecked[permission.code]"
                      @onChecked="onCheck(permission.code)"
                      :disabled="isPermissionAvailable(permission.code)"
                    />

                    <p class="text-sm">{{ permission.description }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Accordion>

          <div class="w-full mt-5 flex justify-end">
            <div class="w-2/5">
              <ButtonInput class="text-sm bg-[#D8E8F2]" :onClick="submit" :loading="loading">
                Save
              </ButtonInput>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
