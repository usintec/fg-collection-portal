<script setup lang="ts">
import ListHolder from '../list/ListHolder.vue'
import { reactive, ref } from 'vue'
import type { IGifmis } from '@/services/types'
import type { IListColumn } from '../list/types'
import Badge from '../badge/Badge.vue'
import { Permissions } from '@/stores/permissionStore'
import GifmisService from '@/services/GifmisService'

const states = reactive({
  balanceData: ref<IGifmis[]>([]),
  loading: false,
  isModalVisible: false
})

const column: IListColumn<IGifmis>[] = [
  {
    id: 'code',
    name: 'Code',
    isSortable: true,
    width: 200,
    dataFiled: 'code'
  },
  {
    id: 'name',
    name: 'Description',
    isSortable: true,
    width: 200,
    dataFiled: 'name'
  },
  {
    id: 'accountType',
    name: 'Account Type',
    isSortable: true,
    width: 200,
    dataFiled: 'accountType'
  },
  {
    id: 'status',
    name: 'Status',
    isSortable: true,
    width: 200,
    dataFiled: 'code',
    cell: true
  }
]
</script>

<template>
  <div class="pb-10 mt-12">
    <ListHolder
      :onCreate="console.log"
      title="All GIFMIS Codes"
      searchTitle="Search by name"
      :data="states.balanceData"
      :columns="column"
      :pagination="true"
      :loading="states.loading"
      :create-single="[Permissions.RejectedAll]"
      :bulk-permission="[Permissions.UploadBulkMDAs]"
      :remotePagination="GifmisService.getGifmisData"
      :api="GifmisService.bulkUpload"
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
          @click="() => console.log(id)"
          class="w-16 h-7 border pointer-cursor hover:scale-105 rounded border-[#6A8BAA] flex justify-center items-center font-satoshi text-xs font-bold text-[#6A8BAA]"
        >
          View
        </div>
      </template>
    </ListHolder>
  </div>
</template>
