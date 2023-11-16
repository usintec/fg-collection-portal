<script setup lang="ts">
import Modal from '../modal/Modal.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { ref } from 'vue'
import RoleService from '@/services/RoleService'
import { useToast } from 'vue-toastification'
import { useRoleStore } from '@/stores/roleStore'
import { getRandomCharacter } from './randomCharacter'
import type { IRole } from '@/services/types'

const toast = useToast()
const loading = ref(false)
const roleStore = useRoleStore()

interface Ipermits {
  show: boolean
  roleId: string
  role: IRole | undefined
}

const props = defineProps<Ipermits>()
const state = ref<Partial<IRole>>({})

const emit = defineEmits<{
  (e: 'closeModal'): void
  (e: 'roleDeleted'): void
}>()

const randomValue = getRandomCharacter()

const submit = async () => {
  loading.value = true
  state.value.uniqueRequestId = randomValue
  try {
    await RoleService.delete(`${props.roleId}`, state.value)

    const data = await RoleService.getAll()
    roleStore.setRole(data)

    toast.success('Role deleted successfully')

    loading.value = false
    emit('closeModal')
    emit('roleDeleted')
  } catch (error) {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      title="Delete role"
      width="w-11/12 lg:w-1/2 xl:w-1/3 2xl:w-1/4"
    >
      <template v-slot:content>
        <div class="mt-5">
          <div>
            <p class="text-base font-normal">
              Are you sure you want to delete
              <span class="font-medium">{{ props.role?.displayName }}</span
              >?
            </p>
          </div>
          <div class="w-full mt-5 flex gap-3">
            <div class="w-1/5">
              <ButtonInput
                class="text-sm h-11 !text-[#204458]"
                :onClick="submit"
                :loading="loading"
                bg="bg-[#FFD0D6]"
              >
                Yes
              </ButtonInput>
            </div>

            <div class="w-1/5">
              <ButtonInput
                class="text-sm h-11 !text-[#204458]"
                bg="bg-[#DEEFFA]"
                :onClick="() => emit('closeModal')"
              >
                Cancel
              </ButtonInput>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
