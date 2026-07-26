<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
import UiTitleCard from "@/components/shared/UiTitleCard.vue";
import { useDashboardStore } from "@/stores/dashboard";

const theme = useTheme();
const successColor = theme.current.value.colors.success;
const errorColor = theme.current.value.colors.error;
const warningColor = theme.current.value.colors.warning;
const dashboardStore = useDashboardStore();

const chartOptions1 = computed(() => {
  return {
    chart: {
      type: "donut",
      height: 400,
      fontFamily: `inherit`,
      foreColor: "rgba(var(--v-theme-secondary), var(--v-high-opacity))",
    },
    labels: dashboardStore.orderStatusLabels,
    colors: [successColor, errorColor, warningColor],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: true,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number): string => value.toLocaleString("en-US"),
      },
    },
  };
});

const donutChart1 = computed(() => ({
  series: dashboardStore.orderStatus,
}));
</script>

<template>
  <ui-title-card
    title="Order Status"
    class-name="pt-5 px-0 rounded-md overflow-hidden"
  >
    <apexchart
      type="donut"
      height="400"
      :options="chartOptions1"
      :series="donutChart1.series"
    >
    </apexchart>
  </ui-title-card>
</template>
