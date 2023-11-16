<script setup lang="ts">
interface IItemCostProps {
  items: { currency: string; cost: string }[]
}

const props = defineProps<IItemCostProps>()
</script>
<template>
  <div class="flex justify-items-end gap-64 mt-2 w-full h-7 bg-white">
    <div class="flex-auto w-70">
      <p class="text-sm font-bold font-satoshi text-[#254E49]">Total</p>
    </div>
    <div class="flex-auto w-30">
      <span
        v-for="(item, index) in props.items"
        :key="item.cost"
        class="text-[#626B8D] font-satoshi text-sm pr-2"
      >
        <span class="text-[#42746F] font-bold font-satoshi" v-if="item.currency == 'NGN'"
          >&#8358;</span
        >
        <span class="text-[#42746F] font-bold font-satoshi" v-if="item.currency == 'USD'"
          >&#36;</span
        >
        <span class="text-[#42746F] font-bold font-satoshi">{{ item.cost }}</span>
        <span
          class="text-[#42746F] font-bold font-satoshi pl-2"
          v-if="index < props.items.length - 1"
          >+</span
        >
      </span>
    </div>
  </div>
</template>
