<script setup lang="ts">
import { useConfigStore } from "@/stores/config";
import type { MenuItem } from "@/types/menu";

import Logo from "@/components/navigation/LogoDark.vue";
import NavGroup from "@/components/navigation/NavGroup.vue";
import NavCollapse from "@/components/navigation/NavCollapse.vue";
import NavItem from "@/components/navigation/NavItem.vue";

const customizer = useConfigStore();

const sidebarItem: MenuItem[] = [
  { header: "Navigation" },
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    to: "/",
  },
];
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.sidebar"
    elevation="0"
    rail-width="60"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="customizer.miniSidebar"
    expand-on-hover
  >
    <div class="p-5">
      <Logo />
    </div>
    <v-list aria-busy="true" aria-label="menu list">
      <template v-for="(item, i) in sidebarItem" :key="i">
        <nav-group :item="item" v-if="item.header" :key="item.title" />
        <v-divider class="my-3" v-else-if="item.divider" />
        <nav-collapse
          class="leftPadding"
          :item="item"
          :level="0"
          v-else-if="item.children"
        />
        <nav-item :item="item" v-else />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
