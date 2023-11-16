<script setup lang="ts">
import { usePayableItems } from '@/stores/payableItemStore'
import DynamicFormRender from '../dynamic-form/DynamicFormRender.vue'
import type { InputElement } from '../dynamic-form/types'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import Modal from '../modal/Modal.vue'
import { computed } from 'vue'

interface IPayableItemForm {
  show: boolean
  id: string
  form: Record<string, InputElement>
}
const props = defineProps<IPayableItemForm>()

const store = usePayableItems()

const updateAdditionalInformation = (value: any) => {
  store.addCustomFiled(props.id, value)
}

const values = computed(() => {
  const item = store.items.find((item) => item.id === props.id)
  if (item) return item.additionalInformation
  else return {}
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
<template>
  <Modal
    :shows="show"
    @closeModal="$emit('close')"
    width="xl:w-5/12 lg:w-1/2 md:w-2/3 sm:w-full"
    title="Payable Items Custom Fields"
  >
    <template v-slot:content>
      <DynamicFormRender
        class="py-4"
        :form="form"
        @update="updateAdditionalInformation"
        :value="values"
      />
      <div class="flex justify-end mt-10">
        <div class="flex w-2/5 gap-5">
          <ButtonInput class="mt-9 text-sm bg-[#D8E8F2]" :onClick="() => emit('close')">
            Save
          </ButtonInput>
        </div>
      </div>
    </template>
  </Modal>
</template>
