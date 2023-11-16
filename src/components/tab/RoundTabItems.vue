<script setup lang="ts">
import RoundTabItem from './RoundTabItem.vue'
import { ref } from 'vue'
interface ITab {
  name: string
}

interface ITabItemProps {
  tabs: ITab[]
  selectedTab?: number
}

const props = defineProps<ITabItemProps>()

const selected = ref<number>(props.selectedTab ?? 0)

const onSelect = (index: number) => {
  selected.value = index
}
</script>
<template>
  <div class="flex flex-col w-full gap-9 pt-4 bg-white">
    <div class="flex flex-row gap-7 bg-[#EEF7FC] rounded-full w-72 px-2 py-1">
      <RoundTabItem
        v-for="(tab, index) in props.tabs"
        :key="tab.name"
        :name="tab.name"
        :selected="selected === index"
        @select="() => onSelect(index)"
      />
    </div>
    <template v-for="(_, index) in props.tabs">
      <div :key="index" v-if="index === selected">
        <slot :name="`tab-${index}`" />
      </div>
    </template>
  </div>
</template>
