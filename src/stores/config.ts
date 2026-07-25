import { ref } from "vue";

import { defineStore } from "pinia";

export const useConfigStore = defineStore("customizer", () => {
  const sidebar = ref(true);
  const miniSidebar = ref(false);

  const toggleSidebar = () => {
    sidebar.value = !sidebar.value;
  };

  const toggleMiniSidebar = () => {
    miniSidebar.value = !miniSidebar.value;
  };

  return {
    sidebar,
    miniSidebar,
    toggleSidebar,
    toggleMiniSidebar,
  };
});
