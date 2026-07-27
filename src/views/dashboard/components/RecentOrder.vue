<script setup lang="ts">
import UiTitleCard from "@/components/shared/UiTitleCard.vue";
import type { RecordItem } from "@/stores/dashboard";

defineProps<{
  records: RecordItem[];
}>();
</script>

<template>
  <ui-title-card title="Recent Transactions" class-name="px-0 pb-0 rounded-md">
    <template v-slot:action>
      <router-link to="/records" class="text-caption text-primary link-hover">
        Show More
      </router-link>
    </template>
    <v-table class="bordered-table" hover density="comfortable">
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
            <v-chip
              variant="text"
              size="small"
              class="px-0"
              v-if="item.status === 'processing'"
            >
              <v-avatar
                size="8"
                color="error"
                variant="flat"
                class="mr-2"
              ></v-avatar>
              <p class="text-h6 mb-0">Processing</p>
            </v-chip>
            <v-chip
              variant="text"
              size="small"
              class="px-0"
              v-else-if="item.status === 'completed'"
            >
              <v-avatar
                size="8"
                color="success"
                variant="flat"
                class="mr-2"
              ></v-avatar>
              <p class="text-h6 mb-0">Completed</p>
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
          </td>
        </tr>
      </tbody>
    </v-table>
  </ui-title-card>
</template>
