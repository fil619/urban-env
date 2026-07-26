<script setup lang="ts">
defineProps<{
  regions: { id: number; name: string }[];
  noFiltersSelected: boolean;
  dateRangeInvalid: boolean;
}>();

const fromDate = defineModel<Date | null>("fromDate", { default: null });
const toDate = defineModel<Date | null>("toDate", { default: null });
const selectedRegion = defineModel<string[]>("selectedRegion", {
  default: () => [],
});
const selectedStatus = defineModel<string[]>("selectedStatus", {
  default: () => [],
});

const emit = defineEmits<{
  (e: "apply"): void;
  (e: "clear"): void;
}>();
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
            hide-details="auto"
            :rules="[
              () =>
                !dateRangeInvalid || 'Start date must not be after end date',
            ]"
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
            hide-details="auto"
            :rules="[
              () =>
                !dateRangeInvalid || 'Start date must not be after end date',
            ]"
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
            multiple
            chips
            closable-chips
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
            multiple
            chips
            closable-chips
            hide-details="auto"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-end ga-2">
          <v-btn variant="outlined" @click="emit('clear')">Clear</v-btn>
          <v-btn
            color="primary"
            :disabled="noFiltersSelected || dateRangeInvalid"
            @click="emit('apply')"
          >
            Apply
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
