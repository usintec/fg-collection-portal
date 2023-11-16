<script setup lang="ts">
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import Button from '@/components/inputs/button/ButtonInput.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>
<template>
  <div
    class="h-screen w-full flex justify-center font-satoshi gap-4 items-center flex-col bg-bg_mint"
  >
    <MaterialIcon class="text-9xl" icon="error_outline" />
    <div class="flex gap-4 justify-center items-center">
      <h1 class="text-4xl italic font-bold">404</h1>
      <div>Page not found</div>
    </div>
    <div>
      <Button :onClick="goHome">Go to home</Button>
    </div>
  </div>
</template>
