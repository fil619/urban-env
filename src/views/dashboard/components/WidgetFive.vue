<script setup lang="ts">
import { onMounted, shallowRef } from "vue";

interface KpiCard {
  name: string;
  earn: string;
  percent: string;
  color: string;
  icon: string;
  text: string;
}

const fivecards = shallowRef<KpiCard[]>([]);

onMounted(async () => {
  const response = await fetch("/api/dashboard/kpis");
  fivecards.value = await response.json();
});
</script>

<template>
  <v-row class="my-0">
    <v-col
      cols="12"
      sm="6"
      md="3"
      v-for="(card, i) in fivecards"
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
                  <v-chip
                    :color="card.color"
                    :border="`${card.color} solid thin opacity-50`"
                    class="ml-2"
                    size="small"
                    label
                  >
                    <template v-slot:prepend>
                      <component
                        :is="card.icon"
                        :style="{ fontSize: '12px' }"
                        :class="'mr-1 text-' + card.color"
                      />
                    </template>
                    {{ card.percent }}
                  </v-chip>
                </h4>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
