import { createPinia } from "pinia";
import { mount, type ComponentMountingOptions } from "@vue/test-utils";
import type { Component } from "vue";
import vuetify from "@/plugins/vuetify";

export function mountWithPlugins<T extends Component>(
  component: T,
  options: ComponentMountingOptions<T> = {},
) {
  return mount(component, {
    ...options,
    global: {
      plugins: [vuetify, createPinia()],
      ...options.global,
    },
  });
}
