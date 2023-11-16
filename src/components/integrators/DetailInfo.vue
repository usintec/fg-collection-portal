<script setup lang="ts">
import TabItems from '../tab/TabItems.vue'
import TextInput from '../inputs/text/TextInput.vue'
import type { IIntegrator } from '@/services/types'
import Credentials from './Credentials.vue'

const props = defineProps<{
  state: Partial<IIntegrator>
  errorMessage?: Partial<IIntegrator>
}>()

const tabs = [
  {
    name: 'Details'
  },
  {
    name: 'Credentials'
  }
]
</script>

<template>
  <div class="">
    <div class="w-full">
      <TabItems class="px-4 rounded-3xl" :tabs="tabs">
        <template v-slot:tab-0>
          <div class="flex w-full px-3 font-satoshi pb-16">
            <div class="w-1/4">
              <p class="text-sm font-medium not-italic">Basic Details</p>
            </div>

            <div class="w-1/2">
              <div class="gap-2">
                <div class="grid grid-cols mt-3">
                  <div class="me-3">
                    <TextInput
                      label="Name"
                      placeholder="Type here"
                      type="text"
                      :onChange="console.log"
                      important="*"
                      :value="props.state?.name"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 mt-3">
                  <div class="me-3">
                    <TextInput
                      label="Email address"
                      placeholder="organization@example.com"
                      type="text"
                      :onChange="console.log"
                      important="*"
                      :value="props.state?.email"
                    />
                  </div>

                  <div>
                    <TextInput
                      label="Official phone number(s)"
                      placeholder="Ex. 080XXXXXXXX"
                      type="text"
                      :onChange="console.log"
                      important="*"
                      :value="props.state?.phoneNumber"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> </template
        >,
        <template v-slot:tab-1> <Credentials :info="props.state" /> </template>
      </TabItems>
    </div>
  </div>
</template>
