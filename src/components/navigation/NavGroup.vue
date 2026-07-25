<script lang="ts" setup>
import type { MenuItem } from "@/types/menu";

defineProps<{
  item: MenuItem;
}>();
</script>

<template>
  <v-list-subheader color="lightText" class="smallCap text-subtitle-2">{{
    item.header
  }}</v-list-subheader>
</template>
