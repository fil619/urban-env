import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", {
  state: () => {
    return {
      //Navigation
      sidebar: true,
      miniSidebar: false,
    };
  },
});
