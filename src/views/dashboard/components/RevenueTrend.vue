<script setup lang="ts">
import { computed, ref } from "vue";
import { useTheme } from "vuetify";
import { useDashboardStore } from "@/stores/dashboard";

const dashboardStore = useDashboardStore();

const theme = useTheme();
const primaryColor = theme.current.value.colors.primary;
const darkprimaryColor = theme.current.value.colors.darkprimary;

const chartOptions1 = computed(() => {
  return {
    chart: {
      type: "area",
      height: 400,
      fontFamily: `inherit`,
      foreColor: "rgba(var(--v-theme-secondary), var(--v-high-opacity))",
      toolbar: false,
    },
    colors: [primaryColor, darkprimaryColor],
    labels: dashboardStore.revenueTrendLabels,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.4,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "rgba(var(--v-theme-borderLight), var(--v-high-opacity))",
    },
    xaxis: {
      axisBorder: {
        show: true,
        color: "rgba(var(--v-theme-borderLight), var(--v-high-opacity))",
      },
      axisTicks: {
        color: "rgba(var(--v-theme-borderLight), var(--v-high-opacity))",
      },
    },
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value: number) => value.toLocaleString("en-US"),
      },
    },
  };
});

const areaChart1 = computed(() => ({
  series: [{ name: "Revenue", data: dashboardStore.revenueTrend }],
}));

const tab = ref(1);
</script>

<template>
  <v-card class="title-card" variant="text">
    <v-card-item class="pb-2 px-0 pt-0">
      <v-card-title class="text-h5">Revenue Trend</v-card-title>
    </v-card-item>
    <v-card-text class="rounded-md overflow-hidden">
      <apexchart
        type="area"
        height="400"
        :options="chartOptions1"
        :series="areaChart1.series"
      >
      </apexchart>
    </v-card-text>
  </v-card>
</template>
