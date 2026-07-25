<script setup lang="ts">
import { ref } from "vue";

import UiTitleCard from "@/components/shared/UiTitleCard.vue";

interface RecordItem {
  id: number;
  date: string;
  businessUnit: string;
  region: string;
  revenue: string;
  transactions: number;
  status: string;
}

interface DataTableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order?: boolean | "asc" | "desc" }[];
  search: string;
}

const records = ref<RecordItem[]>([]);
const totalRecords = ref(0);
const loading = ref(false);
const search = ref("");

const headers = [
  { title: "Date", key: "date" },
  { title: "Business Unit", key: "businessUnit" },
  { title: "Region", key: "region" },
  { title: "Revenue", key: "revenue", align: "end" as const },
  { title: "Transactions", key: "transactions", align: "end" as const },
  { title: "Status", key: "status", sortable: false },
];

async function loadItems(options: DataTableOptions) {
  loading.value = true;

  const params = new URLSearchParams({
    page: String(options.page),
    itemsPerPage: String(options.itemsPerPage),
  });

  if (options.search) {
    params.set("search", options.search);
  }

  const sort = options.sortBy[0];
  if (sort) {
    params.set("sortBy", sort.key);
    params.set("sortOrder", sort.order === "desc" ? "desc" : "asc");
  }

  const response = await fetch(`/api/records?${params.toString()}`);
  const { items, total } = await response.json();

  records.value = items;
  totalRecords.value = total;
  loading.value = false;
}
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
    <v-data-table-server
      class="bordered-table"
      :headers="headers"
      :items="records"
      :items-length="totalRecords"
      :search="search"
      :loading="loading"
      :items-per-page="10"
      hover
      density="comfortable"
      @update:options="loadItems"
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
          v-if="item.status === 'completed'"
        >
          <v-avatar
            size="8"
            color="success"
            variant="flat"
            class="mr-2"
          ></v-avatar>
          <p class="text-h6 mb-0">Completed</p>
        </v-chip>
        <v-chip
          variant="text"
          size="small"
          class="px-0"
          v-else-if="item.status === 'processing'"
        >
          <v-avatar size="8" color="info" variant="flat" class="mr-2"></v-avatar>
          <p class="text-h6 mb-0">Processing</p>
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
    </v-data-table-server>
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
