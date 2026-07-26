<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const fromDate = defineModel<Date | null>("fromDate", { default: null });
const toDate = defineModel<Date | null>("toDate", { default: null });
const selectedRegion = defineModel<string | null>("selectedRegion", {
  default: null,
});
const selectedStatus = defineModel<string | null>("selectedStatus", {
  default: null,
});
const regions = ref<{ id: number; name: string }[]>([]);

const emit = defineEmits<{
  apply: [];
  clear: [];
}>();

onMounted(async () => {
  const response = await fetch("/api/regions");
  regions.value = await response.json();
});

function clearFilters() {
  fromDate.value = null;
  toDate.value = null;
  selectedRegion.value = null;
  selectedStatus.value = null;
  emit("clear");
}

const noFiltersSelected = computed(
  () =>
    !fromDate.value &&
    !toDate.value &&
    !selectedRegion.value &&
    !selectedStatus.value,
);
</script>

<template>
  <v-card class="title-card" variant="text">
    <v-card-item class="pb-2 px-0 pt-0">
      <v-card-title class="text-h5">Filter</v-card-title>
    </v-card-item>
    <v-card-text class="rounded-md overflow-hidden">
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-date-input
            v-model="fromDate"
            label="From Date"
            variant="outlined"
            density="compact"
            prepend-icon=""
            prepend-inner-icon="mdi-calendar"
            hide-details
          ></v-date-input>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-date-input
            v-model="toDate"
            label="To Date"
            variant="outlined"
            density="compact"
            prepend-icon=""
            prepend-inner-icon="mdi-calendar"
            hide-details
          ></v-date-input>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="selectedRegion"
            label="Region"
            variant="outlined"
            density="compact"
            :items="regions"
            item-title="name"
            item-value="name"
            hide-details="auto"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="selectedStatus"
            label="Status"
            variant="outlined"
            density="compact"
            :items="['Pending', 'Processing', 'Completed', 'Rejected']"
            hide-details="auto"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-end ga-2">
          <v-btn variant="outlined" @click="clearFilters">Clear</v-btn>
          <v-btn
            color="primary"
            :disabled="noFiltersSelected"
            @click="emit('apply')"
          >
            Apply
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
