<script setup lang="ts">
import { useConfigStore } from "@/stores/config";

import NotificationDD from "./NotificationDD.vue";
import SearchBar from "./SearchBarPanel.vue";
import ProfileDD from "./ProfileDD.vue";

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
      <menu-fold-outlined :style="{ fontSize: '16px' }" />
    </v-btn>
    <v-menu
      :close-on-content-click="false"
      class="hidden-lg-and-up"
      offset="10, 0"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="hidden-lg-and-up text-secondary ml-1"
          color="lightsecondary"
          icon
          rounded="sm"
          variant="flat"
          size="small"
          v-bind="props"
        >
          <v-icon
            color="blue-darken-2"
            icon="mdi-magnify"
            size="large"
          ></v-icon>
        </v-btn>
      </template>
      <v-sheet class="search-sheet v-col-12 pa-0" width="320">
        <v-text-field
          persistent-placeholder
          placeholder="Search here.."
          color="primary"
          variant="solo"
          hide-details
        >
          <template v-slot:prepend-inner>
            <v-icon
              color="blue-darken-2"
              icon="mdi-magnify"
              size="small"
            ></v-icon>
          </template>
        </v-text-field>
      </v-sheet>
    </v-menu>
    <v-sheet class="d-none d-lg-block" width="250">
      <search-bar />
    </v-sheet>
    <v-spacer />
    <notification-d-d />
    <v-menu :close-on-content-click="false" offset="8, 0">
      <template v-slot:activator="{ props }">
        <v-btn class="profileBtn" variant="text" rounded="sm" v-bind="props">
          <div class="d-flex align-center">
            <v-avatar class="mr-sm-2 mr-0 py-2">
              <img src="@/assets/images/avatar-1.png" alt="Julia" />
            </v-avatar>
          </div>
        </v-btn>
      </template>
      <v-sheet rounded="md" width="290">
        <profile-d-d />
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>
