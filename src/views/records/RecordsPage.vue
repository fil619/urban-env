<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import UiTitleCard from "@/components/shared/UiTitleCard.vue";
import ToolBar from "@/views/dashboard/components/ToolBar.vue";
import { useRecordsStore } from "@/stores/records";
import { useDashboardStore } from "@/stores/dashboard";

interface DataTableOptions {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order?: boolean | "asc" | "desc" }[];
  search: string;
}

const recordsStore = useRecordsStore();
const dashboardStore = useDashboardStore();
const search = ref("");
const searchInput = ref("");
const lastOptions = ref<DataTableOptions | null>(null);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(searchInput, (newVal) => {
  if (debounceTimer != null) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    search.value = newVal;
  }, 500);
});

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

onMounted(() => {
  void dashboardStore.fetchRegions();
});

const headers = [
  { title: "Date", key: "date" },
  { title: "Business Unit", key: "businessUnit" },
  { title: "Region", key: "region" },
  { title: "Revenue", key: "revenue", align: "end" as const },
  { title: "Transactions", key: "transactions", align: "end" as const },
  { title: "Status", key: "status", sortable: false },
];

const fetchWithFilters = (options: DataTableOptions): void => {
  void recordsStore.fetchRecords({
    ...options,
    fromDate: fromDate.value,
    toDate: toDate.value,
    region: selectedRegion.value,
    status: selectedStatus.value,
  });
};

const loadItems = (options: DataTableOptions): void => {
  lastOptions.value = options;
  fetchWithFilters(options);
};

const refetchWithFilters = (): void => {
  if (lastOptions.value) {
    fetchWithFilters({ ...lastOptions.value, page: 1 });
  }
};

const retry = (): void => {
  if (lastOptions.value) {
    fetchWithFilters(lastOptions.value);
  }
};
</script>

<template>
  <div class="mb-5">
    <tool-bar
      v-model:from-date="fromDate"
      v-model:to-date="toDate"
      v-model:selected-region="selectedRegion"
      v-model:selected-status="selectedStatus"
      :regions="dashboardStore.regions"
      :no-filters-selected="noFiltersSelected"
      :date-range-invalid="dateRangeInvalid"
      @apply="refetchWithFilters"
      @clear="refetchWithFilters"
    />
  </div>
  <ui-title-card title="Records" class-name="px-0 pb-0 rounded-md">
    <div class="px-4 pb-4">
      <v-text-field
        v-model="searchInput"
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
      <template #no-data>
        <div class="text-center text-medium-emphasis py-8">
          No records found
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.status="{ item }">
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
          <v-avatar
            size="8"
            color="info"
            variant="flat"
            class="mr-2"
          ></v-avatar>
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
  </ui-title-card>
</template>

<style scoped>
:deep(.v-data-table__th) {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgb(var(--v-theme-containerBg));
}
</style>
