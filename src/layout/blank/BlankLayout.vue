<template>
  <v-app>
    <v-main id="main-content" tabindex="-1">
      <RouterView />
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
