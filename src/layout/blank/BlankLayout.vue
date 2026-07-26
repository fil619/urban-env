<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <v-app>
    <v-main id="main-content" tabindex="-1">
      <router-view />
    </v-main>
  </v-app>
</template>
