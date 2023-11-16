<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import CheckPermission from '../permission/CheckPermission.vue'
import { Permissions } from '@/stores/permissionStore'

interface IHeader {
  name: string
  loading: boolean
}
defineProps<IHeader>()

const emit = defineEmits<{
  (e: 'saveChanges'): void
  (e: 'upload'): void
}>()
</script>

<template>
  <div class="header-bg bg-black h-40 rounded-3xl px-12 pt-6 shadow">
    <span class="font-satoshi font-bold text-base text-[#1A3848]">
      {{ name }}
    </span>
  </div>

  <div class="flex justify-between pl-12 relative">
    <div class="w-36 h-32 rounded-2xl bg-[#94BBD1] relative bottom-12 text-white">
      <CheckPermission :permission="Permissions.UpdateOrganization">
        <div
          class="flex justify-end mt-2 text-center px-2 hover:cursor-pointer"
          @click="() => emit('upload')"
        >
          <MaterialIcon class="bg-[#204458] rounded-full text-sm w-6 h-6" icon="edit" />
        </div>
      </CheckPermission>
      <div class="flex justify-center items-center">
        <MaterialIcon class="text-6xl" icon="business_center" />
      </div>
    </div>
    <CheckPermission :permission="Permissions.UpdateOrganization">
      <div class="">
        <ButtonInput class="mt-8 px-6 py-3" :loading="loading" :onClick="() => emit('saveChanges')">
          Save Changes
        </ButtonInput>
      </div>
    </CheckPermission>
  </div>
</template>

<style>
.header-bg {
  background: url('../../assets/header_bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  background-color: #fff;
  margin: 0;
}
</style>
