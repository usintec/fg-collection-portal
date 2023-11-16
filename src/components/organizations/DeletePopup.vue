<script setup lang="ts">
import Modal from '../modal/Modal.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'

interface Ipermits {
  show: boolean
  title: string
}

defineProps<Ipermits>()

const emit = defineEmits<{
  (e: 'closeModal'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div>
    <Modal
      :shows="show"
      @closeModal="() => emit('closeModal')"
      :title="title"
      width="w-11/12 lg:w-1/2 xl:w-1/3 2xl:w-1/4"
    >
      <template v-slot:content>
        <div class="mt-5">
          <div>
            <p class="text-base font-medium">Are you sure you want to proceed?</p>
          </div>
          <div class="w-full mt-5 flex gap-3">
            <div class="w-1/5">
              <ButtonInput class="text-sm h-11" :onClick="() => emit('delete')" bg="bg-[#DA0722]">
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
