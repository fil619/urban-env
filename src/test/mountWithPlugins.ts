import { createPinia } from "pinia";
import { mount, type ComponentMountingOptions } from "@vue/test-utils";
import type { Component } from "vue";
import vuetify from "@/plugins/vuetify";

// Wraps Vue Test Utils' `mount` with Vuetify and a fresh Pinia instance pre-registered,
// so tests don't need to set up those plugins individually.
export const mountWithPlugins = <T extends Component>(
  component: T,
  options: ComponentMountingOptions<T> = {},
) => {
  return mount(component, {
    ...options,
    global: {
      plugins: [vuetify, createPinia()],
      ...options.global,
    },
  });
};
