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
      v-for="(card5, i) in fivecards"
      :key="i"
      :value="card5"
    >
      <v-card elevation="0">
        <v-card variant="text">
          <v-card-text class="rounded-md">
            <div class="d-flex align-items-center justify-space-between">
              <div>
                <h6 class="text-h6 text-lightText mb-1">{{ card5.name }}</h6>
                <h4 class="text-h4 d-flex align-center mb-0">
                  {{ card5.earn }}
                  <v-chip
                    :color="card5.color"
                    :border="`${card5.color} solid thin opacity-50`"
                    class="ml-2"
                    size="small"
                    label
                  >
                    <template v-slot:prepend>
                      <component
                        :is="card5.icon"
                        :style="{ fontSize: '12px' }"
                        :class="'mr-1 text-' + card5.color"
                      />
                    </template>
                    {{ card5.percent }}
                  </v-chip>
                </h4>
                <span class="text-lightText text-caption pt-5 d-block"
                  >You made an extra
                  <span :class="'text-' + card5.color">{{ card5.text }}</span>
                  this year</span
                >
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</template>
