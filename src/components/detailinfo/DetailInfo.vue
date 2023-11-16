<script setup lang="ts">
import TabItems from '../tab/TabItems.vue'
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import { onMounted, ref } from 'vue'
import type { ILookUp, IOrganization } from '@/services/types'
import OrganizationService from '@/services/OrganizationService'
import LookUpService from '@/services/LookUpService'
import DynamicForm from '@/components/dynamic-form/DynamicForm.vue'

const props = defineProps<{
  state: Partial<IOrganization>
  errorMessage?: Partial<IOrganization>
}>()
const parentOrganizations = ref<ILookUp[]>([])

const emit = defineEmits<{
  (e: 'setState', key: keyof IOrganization, value: string): void
}>()

const lookUp = ref<Record<string, string[]>>({})
const lookUpLoader = ref(false)

const cityLoader = ref(false)

onMounted(async () => {
  lookUpLoader.value = true
  const res = await OrganizationService.getParentOrg()
  parentOrganizations.value = res
  const states = await LookUpService.states()
  lookUp.value = {
    states
  }
  lookUpLoader.value = false
  if (props.state.organizationState) {
    setCountryState(props.state.organizationState)
  }
})

const setCountryState = async (name: string) => {
  setState('organizationState', name)
  cityLoader.value = true
  const cities = await LookUpService.cites(name)
  lookUp.value = {
    ...lookUp.value,
    cities
  }
  cityLoader.value = false
}

const setState = (key: keyof IOrganization, value: string) => {
  emit('setState', key, value)
}

const tabs = [
  {
    name: 'Details'
  },
  {
    name: 'Settings'
  }
]

const textValue = (str: string[]) =>
  str.map((s) => ({
    text: s,
    value: s
  }))
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
                <div class="grid grid-cols">
                  <div class="">
                    <SelectInput
                      label="Parent Organization"
                      :selected="state.parentOrganizationId ?? ''"
                      value="id"
                      :name="['displayName']"
                      :items="parentOrganizations"
                      :onChange="(v) => setState('parentOrganizationId', v)"
                      important
                      :loading="lookUpLoader"
                      :errorMessage="errorMessage?.parentOrganizationId"
                    ></SelectInput>
                  </div>
                </div>

                <div class="grid grid-cols-2 mt-3">
                  <div class="me-3">
                    <TextInput
                      label="Organization name"
                      placeholder="Type here"
                      type="text"
                      :value="state.organizationName"
                      :onChange="(v) => setState('organizationName', v)"
                      important="*"
                      :errorMessage="errorMessage?.organizationName"
                    />
                  </div>

                  <div class="me-3">
                    <TextInput
                      label="Organization code"
                      placeholder="Type here"
                      type="text"
                      :value="state.organizationCode"
                      :onChange="(v) => setState('organizationCode', v)"
                      important="*"
                      :errorMessage="errorMessage?.organizationCode"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 mt-3">
                  <div class="me-3">
                    <TextInput
                      label="Email address"
                      placeholder="organization@example.com"
                      type="text"
                      :value="state.organizationEmail"
                      :onChange="(v) => setState('organizationEmail', v)"
                      important="*"
                      :errorMessage="errorMessage?.organizationEmail"
                    />
                  </div>

                  <div>
                    <TextInput
                      label="Official website URL"
                      placeholder="https://org.min.ng"
                      type="text"
                      :value="state.organizationWebsite"
                      :onChange="(v) => setState('organizationWebsite', v)"
                      important="*"
                      :errorMessage="errorMessage?.organizationWebsite"
                    />
                  </div>
                </div>

                <div class="grid grid-cols mt-3">
                  <div>
                    <TextInput
                      label="Official phone number(s)"
                      placeholder="Ex. 080XXXXXXXX"
                      :value="state.organizationPhoneNumber"
                      type="text"
                      :onChange="(v) => setState('organizationPhoneNumber', v)"
                      important="*"
                      :errorMessage="errorMessage?.organizationPhoneNumber"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />

          <div class="flex w-full px-3 font-satoshi py-16">
            <div class="w-1/4">
              <p class="text-sm font-medium not-italic">Contact Person Information</p>

              <div class="w-40 p-1 bg-[#DEEFFA] rounded mt-4">
                <span class="text-xs text-center flex p-1">
                  <MaterialIcon outline icon="add" class="text-xs me-1" />
                  Add Contact Person
                </span>
              </div>
            </div>
            <div class="w-1/2">
              <div class="gap-2">
                <div class="grid grid-cols">
                  <div class="">
                    <TextInput
                      label="Contact Person Name"
                      placeholder="Adebiyi Adeleye Stephen"
                      type="text"
                      :value="state.organizationContactPersonName"
                      :onChange="console.log"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 mt-3">
                  <div class="me-3">
                    <TextInput
                      label="Email address"
                      placeholder="biyileye@gmail.com"
                      :value="state.organizationContactPersonEmail"
                      type="text"
                      :onChange="console.log"
                    />
                  </div>

                  <div class="me-3">
                    <TextInput
                      label="Phone number"
                      placeholder="08137031202"
                      :value="state.organizationContactPersonPhoneNumber"
                      type="text"
                      :onChange="console.log"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />

          <div class="flex w-full px-3 font-satoshi py-16">
            <div class="w-1/4">
              <p class="text-sm font-medium not-italic">Organization Location</p>
            </div>
            <div class="w-1/2">
              <div class="gap-2">
                <div class="grid grid-cols">
                  <div class="">
                    <TextInput
                      label="Organization address"
                      placeholder="13 Oyeleke Streeet, Alausa Ikeja, Lagos Nigeria"
                      type="text"
                      :value="state.organizationAddress"
                      :onChange="console.log"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 mt-3">
                  <div class="me-3">
                    <SelectInput
                      label="State"
                      :onChange="setCountryState"
                      :selected="state.organizationState"
                      value="value"
                      :name="['text']"
                      :items="textValue(lookUp['states'] ?? [])"
                      :errorMessage="errorMessage?.organizationState"
                      important
                    />
                  </div>

                  <div>
                    <SelectInput
                      label="City"
                      :onChange="(v) => setState('organizationCity', v)"
                      :selected="state.organizationCity"
                      value="value"
                      :name="['text']"
                      :items="textValue(lookUp['cities'] ?? [])"
                      :errorMessage="errorMessage?.organizationCity"
                      :loading="cityLoader"
                      :noDataMessage="
                        lookUp['cities'] === undefined && !cityLoader
                          ? 'Please select state first'
                          : undefined
                      "
                      important
                    />
                  </div>
                </div>
              </div>
            </div>
          </div> </template
        >, <template v-slot:tab-1> <DynamicForm title="Organization Custom Filed" /> </template>,
      </TabItems>
    </div>
  </div>
</template>
