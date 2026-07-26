<script setup lang="ts">
import { ref, onMounted } from "vue";
import ToolBar from "./components/ToolBar.vue";
import WidgetFive from "./components/WidgetFive.vue";
import RevenueTrend from "./components/RevenueTrend.vue";
import RevenueRegion from "./components/RevenueRegion.vue";
import RecentOrder from "./components/RecentOrder.vue";
import { useDashboardStore } from "@/stores/dashboard";

const dashboardStore = useDashboardStore();

const fromDate = ref<Date | null>(null);
const toDate = ref<Date | null>(null);
const selectedRegion = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);

function applyFilters() {
  dashboardStore.fetchFilteredData({
    fromDate: fromDate.value,
    toDate: toDate.value,
    region: selectedRegion.value,
    status: selectedStatus.value,
  });
}

function clearFilters() {
  dashboardStore.fetchFilteredData();
}

onMounted(() => {
  console.log("DashboardPage mounted");
});
</script>

<template>
  <div>
    <div class="mb-5">
      <ToolBar
        v-model:from-date="fromDate"
        v-model:to-date="toDate"
        v-model:selected-region="selectedRegion"
        v-model:selected-status="selectedStatus"
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
      <WidgetFive />
    </v-card>

    <div class="flex flex-col md:flex-row gap-4 mt-5">
      <RevenueTrend />
      <RevenueRegion />
    </div>
    <RecentOrder class="mt-5" />
  </div>
</template>
