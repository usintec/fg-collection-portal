<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
interface IItemProps {
  title: string
  onChange: (v: string) => void
  itemNo: string
  price: string
  currency: string
}

const props = defineProps<IItemProps>()
</script>
<template>
  <div class="flex rounded-md justify-between p-3 mt-3 w-full h-14 bg-[#F3FEFD]">
    <div class="flex-auto w-64">
      <p class="text-sm font-normal font-satoshi text-[#254E49]">
        {{ props.title }} item - {{ props.itemNo }}
      </p>
    </div>
    <div class="flex-auto w-32">
      <span class="text-[#626B8D] font-satoshi text-sm pr-2">Price:</span>
      <span class="text-[42746F] font-satoshi text-sm">
        <span class="text-[#42746F] font-bold fonst-satoshi" v-if="props.currency == 'NGN'"
          >&#8358;</span
        >
        <span class="text-[#42746F] font-bold fonst-satoshi" v-if="props.currency == 'USD'"
          >&#36;</span
        >
        <span class="text-[#42746F] font-bold fonst-satoshi">{{ props.price }}</span>
      </span>
    </div>
    <div class="flex-auto w-4">
      <MaterialIcon
        class="cursor-pointer hover:scale-105 text-sm text-green_regular"
        :onClick="console.log"
        icon="close"
        outline
      />
    </div>
  </div>
</template>
