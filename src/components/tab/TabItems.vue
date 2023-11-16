<script setup lang="ts">
import type { Permissions } from '@/stores/permissionStore'
import TabItem from './TabItem.vue'
import { ref } from 'vue'
import CheckPermission from '../permission/CheckPermission.vue'
interface ITab {
  name: string
  permissions?: Permissions[]
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
    <div class="flex flex-row gap-4 px-3">
      <CheckPermission
        :permission="tab.permissions ?? []"
        :pass="tab.permissions === undefined"
        v-for="(tab, index) in props.tabs"
        :key="tab.name"
      >
        <TabItem :name="tab.name" :selected="selected === index" @select="() => onSelect(index)" />
      </CheckPermission>
    </div>
    <template v-for="(_, index) in props.tabs">
      <div :key="index" v-if="index === selected">
        <slot :name="`tab-${index}`" />
      </div>
    </template>
  </div>
</template>
