<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <v-app>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
