<script setup lang="ts">
import type { PayableItemModel } from '@/services/types'

defineProps<PayableItemModel>()
</script>
<template>
  <div class="h-44 w-2/3 xl:w-1/2 2xl:w-1/3 px-5 py-7 flex flex-col bg-[#F3FEFD] rounded-lg">
    <div
      class="flex flex-col text-dark_green font-normal text-sm items-start pb-5 border-b border-[#D7F0EE]"
    >
      <span class="flex">
        <span class="class-[#204458] font-medium text-base">{{ name }}</span>
        - ({{ code }})
      </span>
      <span>
        Price: <span>{{ price }}</span> GIFMIS: {{ gifmisCode }}
      </span>
    </div>
    <div class="text-dark_green text-sm font-normal mt-5"></div>
  </div>
</template>
