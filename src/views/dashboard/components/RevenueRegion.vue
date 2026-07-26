<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
import UiTitleCard from "@/components/shared/UiTitleCard.vue";
import { useDashboardStore } from "@/stores/dashboard";

const theme = useTheme();
const PrimaryColor = theme.current.value.colors.primary;
const dashboardStore = useDashboardStore();

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
    labels: dashboardStore.revenueByRegionLabels,
    colors: [PrimaryColor],
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
        formatter: (value: number) => value.toLocaleString("en-US"),
      },
    },
  };
});

const barChart1 = computed(() => ({
  series: [{ name: "Revenue", data: dashboardStore.revenueByRegion }],
}));
</script>

<template>
  <ui-title-card
    title="Revenue by Region"
    class-name="pt-5 px-0 rounded-md overflow-hidden"
  >
    <apexchart
      type="bar"
      height="400"
      :options="chartOptions1"
      :series="barChart1.series"
    >
    </apexchart>
  </ui-title-card>
</template>
