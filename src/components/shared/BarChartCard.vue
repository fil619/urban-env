<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
import UiTitleCard from "@/components/shared/UiTitleCard.vue";

const props = defineProps<{
  title: string;
  labels: string[];
  series: number[];
}>();

const theme = useTheme();
const primaryColor = theme.current.value.colors.primary;

const chartOptions1 = computed(() => {
  return {
    chart: {
      type: "bar",
      height: 400,
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 4,
      },
    },
    labels: props.labels,
    colors: [primaryColor],
    stroke: {
      curve: "smooth",
    },
    fill: {
      opacity: 0.6,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      y: {
        formatter: (value: number): string => value.toLocaleString("en-US"),
      },
    },
  };
});

const barChart1 = computed(() => ({
  series: [{ name: "Revenue", data: props.series }],
}));
</script>

<template>
  <ui-title-card :title="title" class-name="pt-5 px-0 rounded-md overflow-hidden">
    <apexchart
      type="bar"
      height="400"
      :options="chartOptions1"
      :series="barChart1.series"
    >
    </apexchart>
  </ui-title-card>
</template>
