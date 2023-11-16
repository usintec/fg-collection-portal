<script setup lang="ts">
import { ref } from 'vue'
import TextInput from '../inputs/text/TextInput.vue'
import { InputTypes, type InputElement } from './types'
import SelectInput from '../inputs/select/SelectInput.vue'

interface RenderProps {
  form: Record<string, InputElement>
  value: Record<string, string>
}

defineProps<RenderProps>()
const emit = defineEmits<{
  (e: 'update', value: Record<string, unknown>): void
}>()

const state = ref<Record<string, unknown>>({})

const setState = (key: string, value: unknown) => {
  state.value = {
    ...state.value,
    [key]: value
  }
  emit('update', state.value)
}
</script>
<template>
  <div class="flex flex-wrap gap-y-2">
    <div v-for="(input, i) of form" :key="i" class="w-1/2 px-2">
      <TextInput
        v-if="input.type !== InputTypes.DROPDOWN"
        :label="input.title"
        :placeholder="input.placeholder"
        :value="value[input.title]"
        @change="(v) => setState(input.title, v)"
        :type="input.type === InputTypes.DATE ? 'date' : 'text'"
      />
      <SelectInput
        v-else
        :selected="value[input.title]"
        :label="input.title"
        :placeholder="input.placeholder"
        :items="input.options ?? []"
        :name="['text']"
        value="value"
        @change="(v) => setState(input.title, v)"
      />
    </div>
  </div>
</template>
