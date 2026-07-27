<script setup lang="ts">
const props = defineProps<{
  title?: string;
  className?: string;
}>();
</script>

<template>
  <v-card class="title-card" variant="text" rounded="md">
    <v-card-item class="pb-2 px-0 pt-0">
      <v-card-title class="text-h5">{{ props.title }}</v-card-title>
      <template v-slot:append>
        <slot name="action" />
      </template>
    </v-card-item>
    <v-card-text variant="outlined" :class="`${props.className}`">
      <slot />
    </v-card-text>
  </v-card>
</template>
