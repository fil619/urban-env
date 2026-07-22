import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", {
  state: () => ({ name: "Eduardo", age: 30, email: "eduardo@example.com" }),
  getters: {
    userAge: (state) => state.age,
  },
  actions: {
    updateName(newName: string) {
      this.name = newName;
    },
  },
});
