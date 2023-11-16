<script setup lang="ts">
defineProps<{
  notes?: string
}>()

const emit = defineEmits<{
  (e: 'onChange', value: string): void
}>()

const onChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('onChange', target.value)
}
</script>

<template>
  <div class="w-full bg-[#F5F8FF] rounded-lg flex flex-col px-4 py-6">
    <span class="text-dark_green text-sm font-medium my-2">Enter Notes / Terms</span>
    <textarea
      placeholder="Enter notes or terms of service for this bill"
      name="comment"
      cols="30"
      :value="notes"
      class="bg-[#F5F8FF] focus:outline-none"
      rows="3"
      @change="onChange"
    ></textarea>
  </div>
</template>
