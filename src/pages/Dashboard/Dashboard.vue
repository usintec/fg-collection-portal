<script setup lang="ts">
import BreadcrumbVue from '@/components/breadcrumb/Breadcrumb.vue'
import CardItem from '@/components/card/CardItem.vue'
import { currencyEnum } from '@/components/card/types'
import TabItems from '@/components/tab/TabItems.vue'
import TestList from '@/components/ui-elements/test/TestList.vue'
import Filter from '@/components/dashboard-filter/Filter.vue'
import Chart from '@/components/organizations/Chart.vue'
import FilterDate from '@/services/DashboardDateFilter'
import {
  ChartType,
  DURATION,
  type ICollection,
  type ICollectionTrend,
  type IFilterReport,
  type IOrganizationReport
} from '@/services/types'
import { onMounted, ref, watch } from 'vue'
import ReportService from '@/services/ReportService'
import CollectionList from './CollectionList.vue'
import SpinnerComponent from '@/components/loader/SpinnerComponent.vue'
import { useOrganizationStore } from '@/stores/organizationStore'

const collectionTarget = ref(5000000)
const orgStore = useOrganizationStore()
const tabs = [{ name: 'Collections' }, { name: 'Payable Items' }, { name: 'Agencies' }]
const loading = ref(true)
const loadingFilter = ref(false)
const reports = ref<{
  organization?: IOrganizationReport
  collection?: ICollection[]
  collectionTrend?: ICollectionTrend
}>({})
const currency = ref('NGN')
const getReport = async () => {
  try {
    loading.value = true
    const [org, col, trend] = await Promise.all([
      ReportService.getOrganizationReport(),
      ReportService.getOrganizationCollection(),
      ReportService.getOrganizationCollectionTrend()
    ])
    reports.value.organization = org
    reports.value.collection = col
    reports.value.collectionTrend = trend
    loading.value = false
  } catch (err) {
    loading.value = false
  }
}
onMounted(async () => getReport())
watch(
  () => orgStore.activeOrganization,
  () => getReport()
)

const filter = async (filterData: IFilterReport) => {
  try {
    FilterDate.filter(filterData)
    if (filterData.startDate && filterData.endDate) {
      let startDate
      let endDate
      loadingFilter.value = true
      const trendType = diffInDays(new Date(filterData.startDate), new Date(filterData.endDate))
      if (trendType != DURATION.HOURLY) {
        startDate = filterData.startDate.split('T')[0]
        endDate = filterData.endDate.split('T')[0]
      }
      const [trend, collection] = await Promise.all([
        ReportService.getOrganizationCollectionTrend(
          filterData.currency,
          trendType,
          startDate ?? filterData.startDate,
          endDate ?? filterData.endDate
        ),
        ReportService.getOrganizationCollection(
          filterData.startDate.split('T')[0],
          (endDate = filterData.endDate.split('T')[0])
        )
      ])
      reports.value.collectionTrend = trend
      reports.value.collection = collection
      if (filterData.currency) currency.value = filterData.currency
      loadingFilter.value = false
    }
  } catch (err) {
    loadingFilter.value = false
  }
}
const diffInDays = (startDate: Date, endDate: Date) => {
  const date1 = new Date(startDate)
  const date2 = new Date(endDate)
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 1))
  if (diffDays <= 24) return DURATION.HOURLY
  else if (diffDays > 24 && diffDays <= 744) return DURATION.DAILY
  else return DURATION.MONTHLY
}
const chart = () => {
  let lineChart
  let doughnutChart
  if (reports.value.collectionTrend?.datasets[0]) {
    lineChart = {
      labels: reports.value.collectionTrend?.labels ?? [],
      datasets: [
        {
          label: 'Collection' ?? '',
          data: reports.value.collectionTrend?.datasets[0].data ?? [],
          maxBarThickness: 32,
          backgroundColor: '#F6BE2D',
          borderColor: '#F6BE2D',
          tension: 0.3
        }
      ]
    }
  }
  if (reports.value.collectionTrend?.datasets[0]) {
    let total = 0
    reports.value.collectionTrend?.datasets[0].data.forEach((v) => (total += v))
    const percentage = Math.round((total / collectionTarget.value) * 100)
    doughnutChart = {
      labels: [],
      datasets: [
        {
          label: 'Revenue' ?? '',
          data: [percentage, 100 - percentage],
          maxBarThickness: 32,
          color: 'white',
          backgroundColor: [percentage >= 50 ? '#56D07F' : '#F6BE2D', '#FFFFFFFF'],
          borderColor: percentage >= 50 ? '#56D07F' : '#F6BE2D',
          tension: 0.3
        }
      ]
    }
  }
  return { lineChart, doughnutChart }
}
</script>

<template>
  <div class="w-full">
    <div v-if="!loading">
      <div class="h-[68px] flex px-8 py-10 items-center justify-between">
        <BreadcrumbVue title="Hello, Administrator," name="Ministry of Works and Finance." />
      </div>
      <Filter :loading="loadingFilter" @apply="(v) => filter(v)" />
      <div class="bg-white px-2 py-2 rounded-[23px] flex gap-5 mx-8">
        <CardItem
          :card="{
            title: 'User Stat',
            icon: 'collections_bookmark',
            currency: currencyEnum.NONE,
            amount: reports.organization?.userCount.toString() ?? '',
            itemCount: reports.organization?.userCount.toString() ?? '',
            itemPercentage: '80'
          }"
          class="bg-[#DAF2E2]"
        />
        <CardItem
          :card="{
            title: 'Sub Organization',
            icon: 'cases',
            currency: currencyEnum.NONE,
            amount: reports.organization?.subOrganizationCount.toString() ?? '',
            itemCount: reports.organization?.subOrganizationCount.toString() ?? '',
            itemPercentage: '80'
          }"
          class="bg-[#E1F4FA]"
        />
        <CardItem
          :card="{
            title: 'Payable Items',
            icon: 'collections_bookmark',
            currency: currencyEnum.NONE,
            amount: reports.organization?.payableItemCount.toString() ?? '',
            itemCount: reports.organization?.payableItemCount.toString() ?? '',
            itemPercentage: '80'
          }"
          class="bg-[#E1E1FA]"
        />
      </div>
      <div class="flex flex-col gap-4 justify-between p-10 md:flex-row" v-if="!loadingFilter">
        <div class="bg-white p-5 rounded-2xl w-7/12">
          <span class="font-satoshi text-[#4A5B87] text-md font-bold"
            >Collection Statistics ({{ currency }})</span
          >
          <Chart :type="ChartType.LINE" :chartData="chart().lineChart"></Chart>
        </div>
        <div class="bg-white p-5 rounded-2xl w-4/12">
          <span class="font-satoshi text-[#4A5B87] text-md font-bold"
            >Total Revenue ({{ currency }})</span
          >
          <Chart :type="ChartType.DOUGHNUT" :chartData="chart().doughnutChart"></Chart>
        </div>
      </div>
      <div class="flex justify-center" v-else>
        <SpinnerComponent />
      </div>
      <div class="bg-white px-2 rounded-[23px] flex mx-8 mt-12" v-if="!loadingFilter">
        <TabItems class="m-1" :tabs="tabs">
          <template v-slot:tab-0> <CollectionList :data="reports.collection" /> </template>,
          <template v-slot:tab-1> <TestList /> </template>,
          <template v-slot:tab-2> <TestList /> </template>,
        </TabItems>
      </div>
    </div>
    <div class="flex justify-center w-full" v-if="loading">
      <SpinnerComponent />
    </div>
  </div>
</template>
