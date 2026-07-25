<script setup lang="ts">
import { ref } from "vue";
import ToolBar from "./components/ToolBar.vue";
import WidgetFive from "./components/WidgetFive.vue";
import RevenueTrend from "./components/RevenueTrend.vue";
import RevenueRegion from "./components/RevenueRegion.vue";
import RecentOrder from "./components/RecentOrder.vue";

const fromDate = ref<Date | null>(null);
const toDate = ref<Date | null>(null);
const selectedRegion = ref<string | null>(null);
const selectedStatus = ref<string | null>(null);
</script>

<template>
  <div>
    <div class="mb-5">
      <ToolBar
        :from-date="fromDate"
        :to-date="toDate"
        :selected-region="selectedRegion"
        :selected-status="selectedStatus"
      />
    </div>
    <WidgetFive />
    <div class="flex flex-col md:flex-row gap-4 mt-4">
      <RevenueTrend />
      <RevenueRegion />
    </div>
    <RecentOrder />
  </div>
</template>
