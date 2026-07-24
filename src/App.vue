<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useConfigStore } from "@/stores/configStore";

const store = useConfigStore();
</script>
