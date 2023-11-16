<script lang="ts" setup>
import type { IOrganization } from '@/services/types'
import MaterialIcon from '../icon/MaterialIcon.vue'

const props = defineProps<{
  organizations: IOrganization[]
  onClick: (e: string) => void
}>()
</script>
<template>
  <div class="p-4">
    <!-- Breadcrumb -->
    <nav
      v-if="props.organizations.length > 1"
      class="flex px-5 py-3 text-[#7F9EB0] text-lg"
      aria-label="Breadcrumb"
    >
      <ol class="inline-flex items-center space-x-1">
        <li
          class="inline-flex items-center"
          v-for="(org, index) of props.organizations"
          :key="org.organizationId"
        >
          <MaterialIcon
            v-if="index > 0"
            icon="chevron_right"
            class="text-[#7F9EB0] hover:text-dark_green text-md"
          />
          <MaterialIcon
            v-else
            icon="keyboard_double_arrow_right"
            class="text-dark_green hover:text-dark_green text-md"
          />
          <span
            :class="{
              'font-bold text-dark_green': props.organizations.length == index + 1
            }"
            class="cursor-pointer"
            @click="onClick(org.organizationId)"
          >
            {{ org.organizationName }}</span
          >
        </li>
      </ol>
    </nav>
  </div>
</template>
