<script setup lang="ts">
import type { IOption, ISearchOrgnisation } from '@/services/types'
import { computed, onMounted, ref, watch } from 'vue'
import TypeHead from '../inputs/typehead/TypeHead.vue'
import OrganizationService from '@/services/OrganizationService'

const showPopup = ref(false)
const mda = ref<ISearchOrgnisation[]>([])
const loading = ref(false)
const text = ref('')

const emit = defineEmits<{
  (e: 'onRowClick', v: ISearchOrgnisation): void
}>()
const props = defineProps<{ class?: any }>()

const onRowClick = (v: IOption) => {
  const organisation = mda.value.find((c) => c.organizationId === v.value)
  if (organisation) emit('onRowClick', organisation)
  showPopup.value = false
}

const mapper = (item: ISearchOrgnisation) => {
  return {
    label: `${item.name}`,
    value: item.organizationId,
    organisationCode: item.code
  }
}
const options = computed({
  get() {
    return mda.value.map(mapper)
  },
  set(value) {
    console.log(value)
  }
})
watch(text, async () => {
  loading.value = true
  const res = await OrganizationService.searchOrganisation(text.value)
  mda.value = res
  loading.value = false
})
onMounted(async () => {
  loading.value = true
  const res = await OrganizationService.getAll()
  mda.value = res.map((value) => ({
    organizationId: value.organizationId,
    name: value.organizationName,
    code: value.organizationCode,
    organizationEmail: value.organizationEmail ?? ''
  }))
  loading.value = false
})
</script>

<template>
  <TypeHead
    label=""
    :value="text"
    :options="options"
    @onChange="(value: string) => (text = value)"
    placeholder=""
    :class="props.class"
    @onRowSelect="onRowClick"
    :loading="loading"
  />
</template>
