<template>
  <v-app>
    <side-bar />
    <header-bar />

    <v-main
      id="main-content"
      class="page-wrapper"
      scrollable
      tabindex="-1"
    >
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import SideBar from "@/components/navigation/SideBar.vue";
import HeaderBar from "@/components/header/HeaderBar.vue";
</script>
