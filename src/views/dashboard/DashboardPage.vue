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
