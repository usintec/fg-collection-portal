<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'

interface empty {
  message: string
  icon: string
  buttonName?: string
}

const props = defineProps<empty>()
const emit = defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div class="px-8 bg-[#F6FAFF] rounded-2xl w-full py-40 mx-auto my-8">
    <div class="flex items-center justify-center">
      <div class="text-center">
        <div
          class="w-[45px] h-[45px] rounded-lg bg-[#DEE7F1] flex items-center justify-center mx-auto"
        >
          <MaterialIcon :icon="`${props.icon}`" class="text-3xl text-[#7BA2B7]" />
        </div>

        <div class="">
          <p class="pt-5 font-satoshi text-sm font-medium">
            {{ props.message }}
          </p>
        </div>

        <div v-if="buttonName" class="flex">
          <ButtonInput
            class="h-[46px] w-[40%] text-[13px] bg-[#204458] mx-auto mt-5"
            @click="() => emit('action')"
          >
            {{ props.buttonName }}
          </ButtonInput>
        </div>
      </div>
    </div>
  </div>
</template>
