<script setup lang="ts">
import MaterialIcon from '../icon/MaterialIcon.vue'
import type { IMenu } from './types'
const props = defineProps<{
  menu: IMenu
  active: boolean
  clicked: (item: IMenu) => void
}>()

const noBg = props.menu.subMenu !== undefined
</script>
<template>
  <div
    @click="() => props.clicked(menu)"
    class="side-item h-12 items-center rounded-lg flex mx-[31px] hover:scale-105 cursor-pointer"
    :class="{
      'text-white font-bold': props.active,
      'text-custom_mint': !props.active,
      'bg-[#315D76]': props.active && !noBg
    }"
  >
    <MaterialIcon
      class="mr-6 pl-1.5"
      outline
      :icon="props.menu.icon"
      :class="[props.active ? 'text-[#ACFDC7]' : 'text-[#A2C3D7]']"
    />
    <span
      :class="{
        'mr-8': props.menu.counter
      }"
      class="text-sm"
    >
      {{ props.menu.label }}</span
    >
    <div class="counter flex justify-center items-center" v-if="props.menu.counter">
      <span class="counter-text">{{ `+${props.menu.counter}` }}</span>
    </div>
  </div>
</template>

<style scoped>
.side-item {
  width: 215px;
  height: 52px;
}

.counter {
  border-radius: 78.261px;
  background: #b0d6bd;
  width: 37.565px;
  height: 18px;
  flex-shrink: 0;
}

.counter-text {
  color: #2b653f;
  font-family: Satoshi;
  font-size: 10.483px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
</style>
