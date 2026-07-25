<script setup lang="ts">
import { shallowRef } from "vue";

import UiTitleCard from "@/components/shared/UiTitleCard.vue";

const records = shallowRef([
  {
    date: "20/12/2023",
    businessUnit: "Retail Banking",
    region: "North America",
    revenue: "£1,245,000",
    transactions: 1248,
    status: "completed",
  },
  {
    date: "21/12/2023",
    businessUnit: "Corporate Banking",
    region: "Europe",
    revenue: "£987,500",
    transactions: 856,
    status: "processing",
  },
  {
    date: "22/12/2023",
    businessUnit: "Wealth Management",
    region: "Asia Pacific",
    revenue: "£2,134,750",
    transactions: 432,
    status: "completed",
  },
  {
    date: "23/12/2023",
    businessUnit: "Insurance",
    region: "Latin America",
    revenue: "£645,200",
    transactions: 521,
    status: "pending",
  },
  {
    date: "24/12/2023",
    businessUnit: "Investment Banking",
    region: "Middle East",
    revenue: "£3,560,000",
    transactions: 187,
    status: "completed",
  },
  {
    date: "25/12/2023",
    businessUnit: "Retail Banking",
    region: "Africa",
    revenue: "£423,800",
    transactions: 674,
    status: "processing",
  },
  {
    date: "26/12/2023",
    businessUnit: "Corporate Banking",
    region: "North America",
    revenue: "£1,789,900",
    transactions: 938,
    status: "completed",
  },
  {
    date: "27/12/2023",
    businessUnit: "Insurance",
    region: "Europe",
    revenue: "£712,450",
    transactions: 603,
    status: "pending",
  },
  {
    date: "28/12/2023",
    businessUnit: "Wealth Management",
    region: "Asia Pacific",
    revenue: "£1,365,700",
    transactions: 351,
    status: "completed",
  },
  {
    date: "29/12/2023",
    businessUnit: "Investment Banking",
    region: "North America",
    revenue: "£4,028,100",
    transactions: 142,
    status: "processing",
  },
]);
</script>

<template>
  <UiTitleCard title="Recent Transactions" class-name="px-0 pb-0 rounded-md">
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
        <tr v-for="item in records" :key="item.date">
          <td class="py-3">
            <router-link
              to="/dashboard/default"
              class="text-secondary link-hover"
              >{{ item.date }}</router-link
            >
          </td>
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
              v-if="item.status === 'rejected'"
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
  </UiTitleCard>
</template>
