<script setup lang="ts" generic="T extends Record<string, any>">
import type { IListProps, RootAPIResponse } from '@/services/types'
import List from './List.vue'
import MaterialIcon from '../icon/MaterialIcon.vue'
import TextInput from '../inputs/text/TextInput.vue'
import SelectInput from '../inputs/select/SelectInput.vue'
import ButtonInput from '../inputs/button/ButtonInput.vue'
import { computed, ref } from 'vue'
import { downloadCsv } from './downloadCsv'
import ClickOutSide from '../ui-elements/ClickOutSide.vue'
import Modal from '../modal/Modal.vue'
import BulkUpload from '../upload/BulkUpload.vue'
import type { Permissions } from '@/stores/permissionStore'
import CheckPermission from '../permission/CheckPermission.vue'

interface IListHolderProps extends IListProps<T> {
  onCreate(): void
  onRowClick?(row: T, index: number): void
  title: string
  searchTitle?: string
  show?: boolean
  createPermission?: Permissions[]
  searchPermission?: Permissions[]
  bulkPermission?: Permissions[]
  createSingle?: Permissions[]
  api?: (file: File) => Promise<RootAPIResponse<T[]>>
}
const props = defineProps<IListHolderProps>()

const filter = ref('')
const value = ref('')
const bulkUpload = ref(false)
const expandMore = ref(false)

const onFilter = (value: string) => {
  filter.value = value
}

const onValue = (_value: string) => {
  value.value = _value
}

const filterData = computed(() => {
  return props.columns
    .filter((c) => !c.cell)
    .map((column) => {
      return {
        id: column.dataFiled,
        status: column.name
      }
    })
})

const onExport = () => {
  downloadCsv(props.columns, props.data, props.title)
}

const exportTemplate = () => {
  downloadCsv(props.columns, [], `${props.title} Upload Template`, true)
}

const filteredData = computed(() => {
  if (filter.value === '') {
    return props.data
  }
  return props.data.filter((item) => {
    return item[filter.value]?.toLowerCase?.()?.includes(value.value.toLowerCase())
  })
})
</script>

<template>
  <div class="bg-white rounded-3xl py-5 px-8 mx-8 font-satoshi my-5">
    <div class="flex justify-between">
      <div>
        <p class="text-[#8E95AF] text-sm font-medium">{{ title }} List</p>
      </div>
      <div>
        <span class="pe-3">
          <MaterialIcon icon="menu" class="text-lg" />
        </span>
        <span class="">
          <MaterialIcon icon="grid_view" class="text-lg" />
        </span>
      </div>
    </div>

    <div class="flex justify-between mt-3">
      <div class="flex">
        <CheckPermission
          :permission="searchPermission ?? []"
          :pass="searchPermission === undefined"
        >
          <TextInput
            label=""
            :placeholder="props.searchTitle ? searchTitle : 'Search item'"
            type="text"
            :onChange="onValue"
            class="w-[345px] h-[46px] me-3"
          />

          <SelectInput
            label=""
            :onChange="onFilter"
            :selected="filter"
            value="id"
            :name="['status']"
            :items="filterData"
            noPadding
            class="w-[120px] h-[44px]"
            placeholder="Choose"
          />
        </CheckPermission>
      </div>

      <div class="flex">
        <ClickOutSide :onClickOutSide="() => (expandMore = false)">
          <CheckPermission
            :permission="createPermission ?? []"
            :pass="createPermission === undefined"
          >
            <div class="me-3 w-[133px] relative" v-if="props.show != true">
              <ButtonInput
                :icon="expandMore ? 'expand_less' : 'expand_more'"
                class="text-[13px] h-[46px]"
                :onClick="() => (expandMore = !expandMore)"
              >
                Add New
              </ButtonInput>
              <div
                id="dropdown"
                class="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                :class="[expandMore ? 'block' : 'hidden']"
              >
                <ul
                  class="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <CheckPermission
                    :permission="createSingle ?? []"
                    :pass="createSingle === undefined"
                  >
                    <li key="new-item">
                      <span
                        @click="onCreate"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        New {{ title }}</span
                      >
                    </li>
                  </CheckPermission>

                  <CheckPermission
                    v-if="api"
                    :permission="bulkPermission ?? []"
                    :pass="bulkPermission === undefined"
                  >
                    <li key="bulk-upload-1">
                      <span
                        @click="() => (bulkUpload = true)"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >Bulk Upload</span
                      >
                    </li>
                  </CheckPermission>
                </ul>
              </div>
            </div>
          </CheckPermission>
        </ClickOutSide>

        <ButtonInput
          class="text-xs font-bold h-[46px] w-[133px] text-[13px] bg-color me-3"
          :onClick="onExport"
        >
          Export
        </ButtonInput>
      </div>
    </div>

    <div>
      <List
        @onRowClick="onRowClick"
        :data="filteredData"
        :columns="columns"
        :pagination="true"
        :loading="loading"
        :remote-pagination="remotePagination"
      >
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope"
          ><slot :name="slot" v-bind="scope"
        /></template>
      </List>
    </div>
    <Modal
      title="Upload Bulk"
      v-if="api"
      :shows="bulkUpload"
      @closeModal="() => (bulkUpload = false)"
      class="flex"
    >
      <template v-slot:content>
        <BulkUpload
          :api="api"
          @download-template="exportTemplate"
          @closeModal="() => (bulkUpload = false)"
        />
      </template>
    </Modal>
  </div>
</template>
