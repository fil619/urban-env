<script setup lang="ts">
import { ref } from "vue";

import UiTitleCard from "@/components/shared/UiTitleCard.vue";
import { useRecordsStore } from "@/stores/records";

interface DataTableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order?: boolean | "asc" | "desc" }[];
  search: string;
}

const recordsStore = useRecordsStore();
const search = ref("");
const lastOptions = ref<DataTableOptions | null>(null);

const headers = [
  { title: "Date", key: "date" },
  { title: "Business Unit", key: "businessUnit" },
  { title: "Region", key: "region" },
  { title: "Revenue", key: "revenue", align: "end" as const },
  { title: "Transactions", key: "transactions", align: "end" as const },
  { title: "Status", key: "status", sortable: false },
];

function loadItems(options: DataTableOptions) {
  lastOptions.value = options;
  recordsStore.fetchRecords(options);
}

function retry() {
  if (lastOptions.value) {
    recordsStore.fetchRecords(lastOptions.value);
  }
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
    <v-alert
      v-if="recordsStore.error"
      type="error"
      variant="tonal"
      class="mx-4 mb-4"
    >
      <div class="d-flex align-center justify-space-between">
        <span>{{ recordsStore.error }}</span>
        <v-btn size="small" variant="text" @click="retry()"> Retry </v-btn>
      </div>
    </v-alert>
    <v-data-table-server
      class="bordered-table"
      :headers="headers"
      :items="recordsStore.items"
      :items-length="recordsStore.total"
      :search="search"
      :loading="recordsStore.loading"
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
