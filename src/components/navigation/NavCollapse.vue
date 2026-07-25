<script lang="ts" setup>
import NavItem from "@/components/navigation/NavItem.vue";
import type { MenuItem } from "@/types/menu";

const props = defineProps<{
  item: MenuItem;
  level: number;
}>();
</script>

<template>
  <v-list-group no-action>
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        :value="item.title"
        rounded
        class="mb-1"
        color="primary"
      >
        <!---Icon  -->
        <template v-slot:prepend>
          <component
            :is="item.icon"
            class="iconClass"
            :level="level"
          ></component>
        </template>
        <!---Title  -->
        <v-list-item-title class="mr-auto">{{ item.title }}</v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle
          v-if="item.subCaption"
          class="text-caption mt-n1 hide-menu"
        >
          {{ item.subCaption }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
    <template v-for="(subitem, i) in item.children" :key="i">
      <nav-collapse
        :item="subitem"
        v-if="subitem.children"
        :level="level + 1"
      />
      <nav-item :item="subitem" :level="level + 1" v-else></nav-item>
    </template>
  </v-list-group>
</template>
