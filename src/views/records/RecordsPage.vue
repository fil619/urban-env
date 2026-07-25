<script setup lang="ts">
import { ref, shallowRef } from "vue";

import UiTitleCard from "@/components/shared/UiTitleCard.vue";

const records = shallowRef([
  {
    date: "20/12/2023",
    businessUnit: "Retail Banking",
    region: "North America",
    revenue: "£1,245,000",
    transactions: 1248,
    status: "completed",
  },
  {
    date: "21/12/2023",
    businessUnit: "Corporate Banking",
    region: "Europe",
    revenue: "£987,500",
    transactions: 856,
    status: "processing",
  },
  {
    date: "22/12/2023",
    businessUnit: "Wealth Management",
    region: "Asia Pacific",
    revenue: "£2,134,750",
    transactions: 432,
    status: "completed",
  },
  {
    date: "23/12/2023",
    businessUnit: "Insurance",
    region: "Latin America",
    revenue: "£645,200",
    transactions: 521,
    status: "pending",
  },
  {
    date: "24/12/2023",
    businessUnit: "Investment Banking",
    region: "Middle East",
    revenue: "£3,560,000",
    transactions: 187,
    status: "completed",
  },
  {
    date: "25/12/2023",
    businessUnit: "Retail Banking",
    region: "Africa",
    revenue: "£423,800",
    transactions: 674,
    status: "processing",
  },
  {
    date: "26/12/2023",
    businessUnit: "Corporate Banking",
    region: "North America",
    revenue: "£1,789,900",
    transactions: 938,
    status: "completed",
  },
  {
    date: "27/12/2023",
    businessUnit: "Insurance",
    region: "Europe",
    revenue: "£712,450",
    transactions: 603,
    status: "pending",
  },
  {
    date: "28/12/2023",
    businessUnit: "Wealth Management",
    region: "Asia Pacific",
    revenue: "£1,365,700",
    transactions: 351,
    status: "completed",
  },
  {
    date: "29/12/2023",
    businessUnit: "Investment Banking",
    region: "North America",
    revenue: "£4,028,100",
    transactions: 142,
    status: "processing",
  },
]);

const search = ref("");

const headers = [
  { title: "Date", key: "date" },
  { title: "Business Unit", key: "businessUnit" },
  { title: "Region", key: "region" },
  { title: "Revenue", key: "revenue", align: "end" as const },
  { title: "Transactions", key: "transactions", align: "end" as const },
  { title: "Status", key: "status", sortable: false },
];
</script>

<template>
  <UiTitleCard title="Records" class-name="px-0 pb-0 rounded-md">
    <div class="px-4 pb-4">
      <v-text-field
        v-model="search"
        label="Search records"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        style="max-width: 320px"
      ></v-text-field>
    </div>
    <v-data-table
      class="bordered-table"
      :headers="headers"
      :items="records"
      :search="search"
      :items-per-page="5"
      hover
      density="comfortable"
    >
      <template v-slot:item.date="{ item }">
        <router-link to="/dashboard/default" class="text-secondary link-hover">
          {{ item.date }}
        </router-link>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip
          variant="text"
          size="small"
          class="px-0"
          v-if="item.status === 'rejected'"
        >
          <v-avatar size="8" color="error" variant="flat" class="mr-2"></v-avatar>
          <p class="text-h6 mb-0">Processing</p>
        </v-chip>
        <v-chip
          variant="text"
          size="small"
          class="px-0"
          v-else-if="item.status === 'completed'"
        >
          <v-avatar
            size="8"
            color="success"
            variant="flat"
            class="mr-2"
          ></v-avatar>
          <p class="text-h6 mb-0">Completed</p>
        </v-chip>
        <v-chip variant="text" size="small" class="px-0" v-else>
          <v-avatar
            size="8"
            color="warning"
            variant="flat"
            class="mr-2"
          ></v-avatar>
          <p class="text-h6 mb-0">Pending</p>
        </v-chip>
      </template>
    </v-data-table>
  </UiTitleCard>
</template>

<style scoped>
:deep(.v-data-table__th) {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgb(var(--v-theme-containerBg));
}
</style>
