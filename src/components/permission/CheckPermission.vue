<script setup lang="ts">
import type { CombineLogic } from '@/services/types'
import { useUserPermission, type Permissions } from '@/stores/permissionStore'

interface IProps {
  permission: Permissions | Permissions[]
  pass?: boolean
  combineLogic?: CombineLogic
}

defineProps<IProps>()
const usePermission = useUserPermission()
</script>
<template>
  <slot v-if="pass"></slot>
  <slot v-else-if="usePermission.permitted(permission, combineLogic)"></slot>
</template>
