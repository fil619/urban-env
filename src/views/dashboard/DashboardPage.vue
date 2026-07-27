<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import ToolBar from "@/views/dashboard/components/ToolBar.vue";
import WidgetFive from "@/views/dashboard/components/WidgetFive.vue";
import RevenueTrend from "@/views/dashboard/components/RevenueTrend.vue";
import BarChartCard from "@/components/shared/BarChartCard.vue";
import OrderStatus from "@/views/dashboard/components/OrderStatus.vue";
import RecentOrder from "@/views/dashboard/components/RecentOrder.vue";
import { useDashboardStore } from "@/stores/dashboard";

const dashboardStore = useDashboardStore();

const fromDate = ref<Date | null>(null);
const toDate = ref<Date | null>(null);
const selectedRegion = ref<string[]>([]);
const selectedStatus = ref<string[]>([]);

const noFiltersSelected = computed(
  () =>
    !fromDate.value &&
    !toDate.value &&
    selectedRegion.value.length === 0 &&
    selectedStatus.value.length === 0,
);

const dateRangeInvalid = computed(
  () => !!fromDate.value && !!toDate.value && fromDate.value > toDate.value,
);

const applyFilters = (): void => {
  void dashboardStore.fetchFilteredData({
    fromDate: fromDate.value,
    toDate: toDate.value,
    region: selectedRegion.value,
    status: selectedStatus.value,
  });
};

const clearFilters = (): void => {
  fromDate.value = null;
  toDate.value = null;
  selectedRegion.value = [];
  selectedStatus.value = [];
  void dashboardStore.fetchFilteredData();
};

onMounted(() => {
  void dashboardStore.fetchDashboardData();
  void dashboardStore.fetchRegions();
});
</script>

<template>
  <div>
    <div class="mb-5">
      <tool-bar
        v-model:from-date="fromDate"
        v-model:to-date="toDate"
        v-model:selected-region="selectedRegion"
        v-model:selected-status="selectedStatus"
        :regions="dashboardStore.regions"
        :no-filters-selected="noFiltersSelected"
        :date-range-invalid="dateRangeInvalid"
        :loading="dashboardStore.filtering"
        @apply="applyFilters"
        @clear="clearFilters"
      />
    </div>

    <v-alert
      v-if="dashboardStore.error"
      type="error"
      variant="tonal"
      class="mb-5"
    >
      <div class="d-flex align-center justify-space-between">
        <span>{{ dashboardStore.error }}</span>
        <v-btn
          size="small"
          variant="text"
          @click="dashboardStore.fetchDashboardData()"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <v-card class="title-card" variant="text">
      <v-card-item class="pb-2 px-0 pt-0">
        <v-card-title class="text-h5">Performance Overview</v-card-title>
      </v-card-item>
      <widget-five :kpis="dashboardStore.kpis" />
    </v-card>

    <div class="flex flex-col md:flex-row gap-4 mt-5">
      <revenue-trend
        :labels="dashboardStore.revenueTrendLabels"
        :series="dashboardStore.revenueTrend"
      />
      <bar-chart-card
        title="Revenue by Region"
        :labels="dashboardStore.revenueByRegionLabels"
        :series="dashboardStore.revenueByRegion"
      />
    </div>
    <div class="flex flex-col md:flex-row gap-4 mt-5">
      <bar-chart-card
        title="Revenue by Business Unit"
        :labels="dashboardStore.revenueByBusinessUnitLabels"
        :series="dashboardStore.revenueByBusinessUnit"
      />
      <order-status
        :labels="dashboardStore.orderStatusLabels"
        :series="dashboardStore.orderStatus"
      />
    </div>
    <recent-order :records="dashboardStore.recentRecords" class="mt-5" />
  </div>
</template>
