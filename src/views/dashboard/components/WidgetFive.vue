<script setup lang="ts">
import type { KpiCard } from "@/stores/dashboard";

defineProps<{
  kpis: KpiCard[];
}>();
</script>

<template>
  <v-row class="my-0">
    <v-col
      cols="12"
      sm="6"
      md="3"
      v-for="(card, i) in kpis"
      :key="i"
      :value="card"
    >
      <v-card elevation="0">
        <v-card variant="text">
          <v-card-text class="rounded-md">
            <div class="d-flex align-items-center justify-space-between">
              <div>
                <h6 class="text-h6 text-lightText mb-1">{{ card.name }}</h6>
                <h4 class="text-h4 d-flex align-center mb-0">
                  {{ card.earn }}
                </h4>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
