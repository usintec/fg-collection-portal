<script setup lang="ts">
import dateFormat from 'dateformat'
import ListHolder from '../list/ListHolder.vue'
import { onMounted, reactive, ref } from 'vue'
import type { IIntegrator } from '@/services/types'
import type { IListColumn } from '../list/types'
import Badge from '../badge/Badge.vue'
import { usePageNameStore } from '@/stores/pageName'
import IntegratorDetail from './IntegratorDetail.vue'
import AddIntegrator from './AddIntegrator.vue'
import IntegratorService from '@/services/IntegratorService'
import { useIntegratorStore } from '@/stores/integratorStore'

const menuStore = usePageNameStore()
const showForm = ref(false)

const states = reactive({
  data: ref<IIntegrator[]>([]),
  intStore: useIntegratorStore(),
  loading: false,
  isModalVisible: false
})

const column: IListColumn<IIntegrator>[] = [
  {
    id: 'createdAt',
    name: 'Date',
    isSortable: true,
    dataFiled: 'createdOn',
    width: 200,
    cell: true
  },
  {
    id: 'code',
    name: 'Name',
    isSortable: true,
    width: 200,
    dataFiled: 'name'
  },
  {
    id: 'code',
    name: 'Email Address',
    isSortable: true,
    width: 200,
    dataFiled: 'email'
  },
  {
    id: 'code',
    name: 'Integrator Type',
    isSortable: true,
    width: 200,
    dataFiled: 'integratorType'
  },
  {
    id: 'status',
    name: 'Status',
    isSortable: true,
    width: 200,
    dataFiled: 'id',
    cell: true
  },
  {
    id: 'action',
    name: 'Action',
    isSortable: true,
    width: 200,
    dataFiled: 'id',
    cell: true
  }
]

const modal = () => {
  states.isModalVisible = true
}

const pull = async () => {
  states.loading = true
  const data = await IntegratorService.getAll()
  states.data = data
  states.loading = false
  menuStore.setPageName('Third Party Organizations')
}

onMounted(() => {
  pull()
})

const select = (id: string) => {
  const selectedIntegrator = states.data.find((integrator) => integrator.id == id)
  states.intStore.addToIntegratorStack(selectedIntegrator)
  states.intStore.setActiveOrganization(selectedIntegrator)
  showForm.value = true
}

const close = () => {
  states.isModalVisible = false
  pull()
}

const back = () => {
  showForm.value = false
}
</script>

<template>
  <div class="pb-10 mt-12">
    <ListHolder
      :onCreate="modal"
      title="Third Party Organization"
      searchTitle="Search by name"
      :data="states.data"
      :columns="column"
      :pagination="true"
      :loading="states.loading"
      v-if="!showForm"
    >
      <template #status="{ id }">
        <Badge class="success">
          <template v-slot:content>
            <span @click="() => console.log(id)"> Active </span>
          </template>
        </Badge>
      </template>
      <template #action="{ id }">
        <div
          @click="() => select(id)"
          class="w-16 h-7 border pointer-cursor hover:scale-105 rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
        >
          View
        </div>
      </template>
      <template #createdAt="{ createdOn }">
        {{ dateFormat(createdOn, 'dd mmm, yyyy') }}
      </template>
    </ListHolder>

    <AddIntegrator :show="states.isModalVisible" @closeModal="close" />
    <IntegratorDetail :show="showForm" v-if="showForm" @back="back" />
  </div>
</template>
