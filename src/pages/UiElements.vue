<template>
  <div>
    <div class="section w-full">
      <Breadcrumb title="Create a new Payable Item" name="Add new payable item" />
    </div>
    <div class="rounded-t-lg bg-white">
      <TabItems class="m-4" :tabs="tabs">
        <template v-slot:tab-0> <MaterialIconVue icon="add" /></template>,
        <template v-slot:tab-1> <MaterialIconVue icon="done" /></template>,
        <template v-slot:tab-2> <MaterialIconVue icon="close" /></template>,
      </TabItems>
    </div>

    <TestList />
    <BillInvoice :billId="'9c499baa-1d64-46dc-8858-51ab4c32b23d'"></BillInvoice>
    <Modal :shows="false" @closeModal="closeModal" class="flex">
      <template v-slot:content>
        <div class="w-2/5">
          <Stepper :steps="steps" :currentStep="step" />
        </div>

        <OnBoarding :step="step" @next="next" :loading="loading" />
      </template>
    </Modal>

    <div class="flex gap-4 px-5">
      <Badge class="success">
        <template v-slot:content>Success</template>
      </Badge>

      <Badge class="primary">
        <template v-slot:content>Primary</template>
      </Badge>

      <Badge class="warning">
        <template v-slot:content>Warning</template>
      </Badge>

      <Badge class="danger">
        <template v-slot:content>Danger</template>
      </Badge>
    </div>

    <div class="mt-5 px-5">
      <Header name="Federal Ministry of Works Details" :loading="false" />
    </div>

    <div class="flex justify-center h-full">
      <DetailInfo
        class="w-full mx-3 rounded-t-lg mt-5"
        :state="{}"
        :errorMessage="{}"
        @setState="console.log"
      />
    </div>

    <div class="mx-8">
      <EmptyList
        message="You have no payable items created yet. Create your first payable item below"
        icon="payments"
        buttonName="New Bill"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '../components/breadcrumb/Breadcrumb.vue'
import Header from '@/components/header/Header.vue'
import TabItems from '@/components/tab/TabItems.vue'
import MaterialIconVue from '@/components/icon/MaterialIcon.vue'
import Modal from '../components/modal/Modal.vue'
import Stepper from '@/components/stepper/Stepper.vue'
import OnBoarding from '@/components/onboarding/OnBoarding.vue'
import Badge from '@/components/badge/Badge.vue'
import DetailInfo from '@/components/detailinfo/DetailInfo.vue'
import TestList from '@/components/ui-elements/test/TestList.vue'
import EmptyList from '@/components/list/EmptyList.vue'
import { ref, onMounted } from 'vue'
import BillInvoice from '@/components/invoice/BillInvoice.vue'

const isModalVisible = ref(false)
const step = ref(0)

onMounted(() => {
  isModalVisible.value = true
})
const steps = ['Setup your Organization', 'Add Organization Admin']

const loading = ref(false)

const closeModal = () => {
  isModalVisible.value = false
}

const next = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    step.value++
  }, 1000)
}

const tabs = [
  {
    name: 'Collections'
  },
  {
    name: 'Payable Items'
  },
  {
    name: 'Agencies'
  }
]
</script>
