<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import { computed, ref, watch } from 'vue'
import TypeHeadSearch from './TypeHeadSearch.vue'
import ClickOutSide from '@/components/ui-elements/ClickOutSide.vue'
import type { IOption } from '@/services/types'

interface IInputProps {
  label: string
  showAddButton?: boolean
  type?: string
  placeholder?: string
  important?: boolean
  errorMessage?: string
  value?: string
  whiteBg?: boolean
  options: IOption[]
  loading?: boolean
}

const props = defineProps<IInputProps>()
const showPassword = ref(false)
const emit = defineEmits<{
  (e: 'onChange', value: string): void
  (e: 'addNew'): void
  (e: 'onRowSelect', v: IOption): void
}>()

const showPopup = ref(false)
const text = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const close = () => {
  showPopup.value = false
}

const onChange = (e: Event) => {
  const target = (e.target as HTMLInputElement).value
  text.value = target
  emit('onChange', target)
}

watch(
  () => props.value,
  (value) => {
    if (value) {
      text.value = value
    }
  }
)

const onFocus = () => {
  showPopup.value = true
}

const onRowClick = (v: IOption) => {
  text.value = v.label
  emit('onRowSelect', v)
  showPopup.value = false
  text.value = ''
}

const openUp = computed(() => {
  if (!inputRef.value) return false
  const { bottom } = inputRef.value.getBoundingClientRect()
  const bottomOfScreen = window.innerHeight
  return bottom + props.options.length * 100 > bottomOfScreen
})
</script>
<template>
  <ClickOutSide @clickOutSide="close">
    <div class="flex relative flex-col gap-1">
      <label class="text-dark_green text-sm font-medium"
        >{{ label }} <span v-if="important" class="text-red-600">*</span></label
      >
      <div class="w-full relative h-11">
        <div class="w-full h-full flex items-center flex-row-reverse">
          <input
            ref="inputRef"
            class="w-full h-full bg-[#F6F8FF] rounded-lg px-4 focus:outline-[#F6F8FF]"
            :class="{
              'border border-red-600 focus:outline-red-500': errorMessage,
              'bg-white text-[4B526C] font-normal': whiteBg
            }"
            :placeholder="placeholder"
            @input="onChange"
            :value="text"
            @focus="onFocus"
            :type="showPassword ? 'text' : type"
          />
          <div class="flex gap-5 absolute my-4 mr-1 items-center">
            <MaterialIcon
              class="cursor-pointer hover:scale-105 text-dark_green"
              icon="search"
              outline
            />
            <div
              v-if="showAddButton"
              @click="$emit('addNew')"
              class="flex gap-1 bg-[#DFE7FB] rounded-md p-3 h-10 items-center justify-center cursor-pointer hover:scale-105"
            >
              <MaterialIcon
                class="cursor-pointer hover:scale-105 text-[#7C93C7]"
                icon="add"
                outline
              />
              <span class="text-[#405585] font-normal text-xs">Add New</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showPopup"
        class="w-full absolute z-50 bottom-[4.3rem]"
        :class="[openUp ? 'bottom-[4.3rem]' : 'top-[4.3rem]']"
      >
        <TypeHeadSearch
          :options="options"
          addMore
          @close="close"
          @addNew="$emit('addNew')"
          @onRowClick="onRowClick"
          :loading="loading"
        />
      </div>
    </div>
  </ClickOutSide>
</template>
