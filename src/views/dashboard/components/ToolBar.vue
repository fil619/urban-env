<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  fromDate: Date | null;
  toDate: Date | null;
  selectedRegion: string | null;
  selectedStatus: string | null;
}>();

const fromDate = ref(props.fromDate);
const toDate = ref(props.toDate);
const selectedRegion = ref(props.selectedRegion);
const selectedStatus = ref(props.selectedStatus);
const regions = ref<string[]>([]);

onMounted(async () => {
  const response = await fetch("/api/regions");
  regions.value = await response.json();
});
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
    </v-card-text>
  </v-card>
</template>
