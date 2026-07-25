<script setup lang="ts">
import WidgetFive from "./components/WidgetFive.vue";
import RevenueTrend from "./components/RevenueTrend.vue";
import RevenueRegion from "./components/RevenueRegion.vue";
import RecentOrder from "./components/RecentOrder.vue";
</script>

<template>
  <div>
    <WidgetFive />
    <div class="flex flex-col md:flex-row gap-4 mt-4">
      <RevenueTrend />
      <RevenueRegion />
    </div>
    <RecentOrder />
  </div>
</template>
