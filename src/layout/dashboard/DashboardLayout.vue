<template>
  <v-app>
    <side-bar />
    <header-bar />

    <v-main class="page-wrapper">
      <v-container class="h-full flex items-center" max-width="900">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import SideBar from "@/components/navigation/SideBar.vue";
import HeaderBar from "@/components/header/HeaderBar.vue";
</script>
