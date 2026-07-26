<script setup lang="ts">
import { useConfigStore } from "@/stores/config";

import NotificationDD from "./NotificationDD.vue";

const customizer = useConfigStore();
</script>

<template>
  <v-app-bar elevation="0" height="60">
    <v-btn
      class="hidden-md-and-down text-secondary mr-3"
      color="darkText"
      icon
      rounded="sm"
      variant="text"
      @click.stop="customizer.toggleMiniSidebar()"
      size="small"
      aria-label="Toggle Sidebar"
    >
      <v-icon
        color="blue-darken-2"
        icon="mdi-format-align-justify"
        size="large"
      ></v-icon>
    </v-btn>

    <v-btn
      class="hidden-lg-and-up text-secondary ms-3"
      color="darkText"
      icon
      rounded="sm"
      variant="text"
      @click.stop="customizer.toggleSidebar()"
      size="small"
    >
      <v-icon
        color="blue-darken-2"
        icon="mdi-format-align-justify"
        size="large"
      ></v-icon>
    </v-btn>
    <v-spacer />
    <notification-d-d />
  </v-app-bar>
</template>
