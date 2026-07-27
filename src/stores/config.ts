import { ref } from "vue";

import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", () => {
  const sidebar = ref(true);
  const miniSidebar = ref(false);

  const toggleSidebar = (): void => {
    sidebar.value = !sidebar.value;
  };

  const toggleMiniSidebar = (): void => {
    miniSidebar.value = !miniSidebar.value;
  };

  return {
    sidebar,
    miniSidebar,
    toggleSidebar,
    toggleMiniSidebar,
  };
});
