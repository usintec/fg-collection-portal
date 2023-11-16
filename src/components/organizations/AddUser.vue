<script setup lang="ts">
import Modal from '../modal/Modal.vue'
import TextInput from '../inputs/text/TextInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import { ref, computed } from 'vue'
import { useRoleStore } from '@/stores/roleStore'

const loading = ref(false)
const roleStore = useRoleStore()
const role = computed(() => roleStore.role || [])

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
}>()
</script>

<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      title="Add a new user"
      width="w-11/12 lg:w-1/2 xl:w-5/12 2xl:w-1/4"
    >
      <template v-slot:content>
        <div class="mt-5">
          <div class="grid grid-cols-2 gap-5">
            <TextInput
              label="First Name"
              :onChange="console.log"
              placeholder="Ex. John"
              type="text"
              class="mb-3"
            />

            <TextInput
              label="Last Name"
              :onChange="console.log"
              placeholder="Ex. Doe"
              type="text"
              class="mb-3"
            />
          </div>

          <div class="mb-3">
            <TextInput
              label="Email Address"
              :onChange="console.log"
              placeholder="Ex. john@example.com"
              type="text"
              class="mb-3"
            />
          </div>

          <div class="mb-3">
            <SelectInput
              label="Role"
              :onChange="console.log"
              value="displayName"
              :name="['displayName']"
              :items="role"
              placeholder="Choose"
            />
          </div>

          <div class="w-full mt-5 flex justify-end">
            <div class="w-2/5">
              <ButtonInput class="text-sm bg-[#D8E8F2]" :onClick="console.log" :loading="loading">
                Proceed
              </ButtonInput>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
