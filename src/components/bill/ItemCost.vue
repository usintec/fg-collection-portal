<script setup lang="ts">
interface IItemCostProps {
  title: string
  qty: string
  price: string
  currency: string
}

const props = defineProps<IItemCostProps>()
</script>
<template>
  <div class="flex justify-items-end gap-64 mt-2 w-full h-7 bg-white">
    <div class="flex-auto w-70">
      <p class="text-sm font-normal font-satoshi text-[#254E49]">
        {{ props.qty }} item - {{ props.title }}
      </p>
    </div>
    <div class="flex-auto w-30">
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
  </div>
</template>
