<script setup lang="ts">
import { Bar, Pie, Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  ArcElement,
  PointElement
} from 'chart.js'
import { computed, ref } from 'vue'
import { ChartType, type ICollectionTrend } from '@/services/types'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  ArcElement,
  PointElement
)

const props = defineProps<{
  type: ChartType
  chartData?: ICollectionTrend
}>()

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true
})

const chartStyles = computed(() => {
  return {
    width: '120%',
    height: '20ch'
  }
})
</script>
<template>
  <div v-if="props.chartData">
    <Bar
      :options="chartOptions"
      :data="props.chartData"
      :style="chartStyles"
      v-if="props.type == ChartType.BAR"
    />
    <Line
      :options="chartOptions"
      :data="props.chartData"
      :style="{ width: '250%' }"
      v-if="props.type == ChartType.LINE"
    />
    <Pie
      :options="chartOptions"
      :data="props.chartData"
      :style="chartStyles"
      v-if="props.type == ChartType.PIE"
    />
    <div v-if="props.type == ChartType.DOUGHNUT" class="w-full h-[100%] relative px-6">
      <div
        class="w-full h-1/8 absolute left-0 text-center text-4xl pl-5 my-[40%] font-satoshi text-[#4A5B87]; ]"
      >
        {{ $props.chartData?.datasets[0].data[0] }}%
      </div>
      <Doughnut
        class="absolute"
        :options="chartOptions"
        :data="props.chartData"
        :style="chartStyles"
      />
    </div>
  </div>
</template>
