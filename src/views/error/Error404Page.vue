<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <router-link to="/" class="d-inline-flex justify-center mb-8">
          <logo />
        </router-link>
        <h1 class="error-code font-weight-bold text-primary mb-2">404</h1>
        <h2 class="text-h5 font-weight-medium mb-2">Page Not Found</h2>
        <p class="text-body-1 text-medium-emphasis mb-8">
          Sorry, the page you are looking for doesn't exist or has been
          moved.
        </p>
        <v-btn color="primary" size="large" rounded="lg" to="/">
          Back to Home
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import Logo from "@/components/navigation/LogoDark.vue";
</script>

<style scoped>
.error-code {
  font-size: clamp(4rem, 12vw, 8rem);
  line-height: 1;
}
</style>
