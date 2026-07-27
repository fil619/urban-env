<script setup lang="ts">
import { useDisplay } from "vuetify";
import UiTitleCard from "@/components/shared/UiTitleCard.vue";
import type { RecordItem } from "@/stores/dashboard";

defineProps<{
  records: RecordItem[];
}>();

const { mobile } = useDisplay();

const statusColor = (status: string): string => {
  if (status === "processing") return "error";
  if (status === "completed") return "success";
  return "warning";
};

const statusLabel = (status: string): string => {
  if (status === "processing") return "Processing";
  if (status === "completed") return "Completed";
  return "Pending";
};
</script>

<template>
  <ui-title-card title="Recent Transactions" class-name="px-0 pb-0 rounded-md">
    <template v-slot:action>
      <router-link to="/records" class="text-caption text-primary link-hover">
        Show More
      </router-link>
    </template>

    <v-table v-if="!mobile" class="bordered-table" hover density="comfortable">
      <thead class="bg-containerBg">
        <tr>
          <th class="text-left text-caption font-weight-bold text-uppercase">
            Date
          </th>
          <th class="text-left text-caption font-weight-bold text-uppercase">
            Business Unit
          </th>
          <th
            class="text-left text-caption font-weight-bold text-uppercase"
            style="min-width: 100px"
          >
            Region
          </th>
          <th class="text-right text-caption font-weight-bold text-uppercase">
            Revenue
          </th>
          <th class="text-right text-caption font-weight-bold text-uppercase">
            Transactions
          </th>
          <th class="text-left text-caption font-weight-bold text-uppercase">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="records.length === 0">
          <td colspan="6" class="text-center text-medium-emphasis py-8">
            No transactions found
          </td>
        </tr>
        <tr v-for="item in records" :key="item.date">
          <td class="py-3">{{ item.date }}</td>
          <td class="py-3">{{ item.businessUnit }}</td>
          <td class="py-3">{{ item.region }}</td>
          <td class="py-3 text-right" style="min-width: 100px">
            {{ item.revenue }}
          </td>
          <td class="py-3 text-right" style="min-width: 100px">
            {{ item.transactions }}
          </td>
          <td class="py-3">
            <v-chip variant="text" size="small" class="px-0">
              <v-avatar
                size="8"
                :color="statusColor(item.status)"
                variant="flat"
                class="mr-2"
              ></v-avatar>
              <p class="text-h6 mb-0">{{ statusLabel(item.status) }}</p>
            </v-chip>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-data-iterator v-else :items="records" items-per-page="-1">
      <template v-slot:default="{ items }">
        <div
          v-if="items.length === 0"
          class="text-center text-medium-emphasis py-8"
        >
          No transactions found
        </div>
        <v-card
          v-for="{ raw: item } in items"
          :key="item.date"
          variant="outlined"
          class="mx-4 mb-3"
        >
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-caption text-medium-emphasis">{{
                item.date
              }}</span>
              <v-chip variant="text" size="small" class="px-0">
                <v-avatar
                  size="8"
                  :color="statusColor(item.status)"
                  variant="flat"
                  class="mr-2"
                ></v-avatar>
                <p class="text-h6 mb-0">{{ statusLabel(item.status) }}</p>
              </v-chip>
            </div>
            <div class="d-flex justify-space-between mb-1">
              <span class="text-body-2">{{ item.businessUnit }}</span>
              <span class="text-body-2 text-medium-emphasis">{{
                item.region
              }}</span>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-between">
              <div>
                <div class="text-caption text-medium-emphasis">Revenue</div>
                <div class="text-subtitle-2 font-weight-bold">
                  {{ item.revenue }}
                </div>
              </div>
              <div class="text-right">
                <div class="text-caption text-medium-emphasis">
                  Transactions
                </div>
                <div class="text-subtitle-2 font-weight-bold">
                  {{ item.transactions }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-data-iterator>
  </ui-title-card>
</template>
