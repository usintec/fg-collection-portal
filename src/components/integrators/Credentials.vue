<script setup lang="ts">
import ButtonInput from '../inputs/button/ButtonInput.vue'
import TextInput from '@/components/inputs/text/TextInput.vue'
import MaterialIcon from '@/components/icon/MaterialIcon.vue'
import Toggle from '../inputs/toggle/Toggle.vue'
import { ref, onMounted } from 'vue'
import AddKeyForm from './AddKeyForm.vue'
import CredentialPermissions from './CredentialPermissions.vue'
import type { IIntegrator, IKey } from '@/services/types'
import IntegratorService from '@/services/IntegratorService'
import ApiKeyService from '@/services/ApiKeyService'
import SpinnerComponent from '../loader/SpinnerComponent.vue'
import { useToast } from 'vue-toastification'

const props = defineProps<{
  info: Partial<IIntegrator>
  errorMessage?: Partial<IIntegrator>
}>()

const isActive = ref(false)
const addKey = ref(false)
const showPermission = ref(false)
const data = ref<IKey[]>([])
const loading = ref(false)
const toast = useToast()
const isLive = ref(false)
const keyID = ref('')

const toggle = () => {
  isActive.value = !isActive.value
}

const close = () => {
  pull()
  addKey.value = false
}

const exit = () => {
  pull()
  showPermission.value = false
}

const pull = async () => {
  loading.value = true
  const datas = await IntegratorService.getKey(`${props.info.id}`)
  data.value = datas
  loading.value = false
}

onMounted(() => {
  pull()
})

const regenerate = async (id: any) => {
  loading.value = true
  try {
    await ApiKeyService.regenerate(id)
    toast.success('Regenerated successfully')
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

const showKeyPermission = async (id: any, live: any) => {
  isLive.value = live
  keyID.value = id
  showPermission.value = true
}

const handleCopy = (key: any) => {
  navigator.clipboard.writeText(key)
  toast.success('Copied successfully')
}

const handleCopyCallback = (key: any) => {
  navigator.clipboard.writeText(key)
  toast.success('Copied successfully')
}
</script>
<template>
  <div>
    <div>
      <div class="px-4 flex justify-between items-center">
        <div></div>
      </div>
      <div class="w-full">
        <div class="mx-3 rounded-lg pb-8">
          <div class="flex flex-col w-full">
            <div class="flex justify-between mb-5 border-b px-5 pb-3">
              <div>
                <p class="text-[#123770] text-sm flex justify-center gap-2 items-center">
                  Public Key
                  <span class=""
                    ><MaterialIcon icon="help" class="text-base text-[#119AE7]"
                  /></span>
                </p>
              </div>
              <div>
                <p class="text-[#123770] text-sm flex justify-center gap-2 items-center">
                  Secret Key
                  <span class=""
                    ><MaterialIcon icon="help" class="text-base text-[#119AE7]"
                  /></span>
                </p>
              </div>
              <div>
                <p
                  class="text-[#2BAAF0] text-sm flex gap-1 justify-center items-center hover:cursor-pointer"
                  @click="() => (addKey = true)"
                >
                  <MaterialIcon icon="add" class="text-base" />
                  Add New Key
                </p>
              </div>
            </div>

            <div class="flex justify-center pt-3" v-if="loading">
              <SpinnerComponent />
            </div>
            <div
              class="text-sm text-dark_green px-5 py-3 flex mb-3 gap-4 justify-between items-center border rounded-lg"
              v-for="datas in data"
              :key="datas.id"
              v-else
            >
              <div class="w-full relative">
                <div class="my-2 flex gap-5 items-center">
                  <div>
                    <Toggle :isActive="Boolean(datas.isLive)" :onChange="toggle" />
                    <span class="text-[#204458] text-xs font-medium">{{ datas.name }}</span>
                  </div>

                  <div>
                    <p
                      class="text-[#2BAAF0] text-xs font-medium flex gap-1 justify-center items-center hover:cursor-pointer"
                      @click="() => showKeyPermission(datas.id, datas.isLive)"
                    >
                      View Permissions
                    </p>
                  </div>
                </div>

                <TextInput
                  :onChange="console.log"
                  placeholder="Type here"
                  label=""
                  :value="datas.publicKey"
                  disabled
                  type="text"
                  copy
                  :copyCallback="() => handleCopy(datas.publicKey)"
                />
              </div>

              <div class="w-full mt-9 relative">
                <TextInput
                  :onChange="console.log"
                  placeholder="Type here"
                  label=""
                  :value="datas.secretKey"
                  disabled
                  type="password"
                  copy
                  :copyCallback="() => handleCopyCallback(datas.secretKey)"
                />
              </div>
              <div class="w-2/5 mt-10">
                <ButtonInput
                  class="text-sm !text-[#204458] h-11"
                  :onClick="() => regenerate(datas.id)"
                  :loading="loading"
                  :bg="'bg-[#DEEFFA]'"
                >
                  Re-Generate Keys
                </ButtonInput>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddKeyForm :info="props.info" :show="addKey" @closeModal="close" />
      <CredentialPermissions :live="isLive" :show="showPermission" @closeModal="exit" :id="keyID" />
    </div>
  </div>
</template>
