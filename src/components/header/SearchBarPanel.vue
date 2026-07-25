<script lang="ts" setup>
// icons
</script>

<template>
  <v-text-field
    persistent-placeholder
    color="primary"
    variant="outlined"
    hide-details
    density="compact"
  >
    <template v-slot:prepend-inner>
      <v-icon color="blue-darken-2" icon="mdi-magnify" size="large"></v-icon>
    </template>
  </v-text-field>
</template>
