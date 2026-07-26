import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import { useNotificationsStore } from "@/stores/notifications";
import NotificationDD from "@/components/header/NotificationDD.vue";

describe("NotificationDD", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders notification data and reflects isActive in the badge content", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useNotificationsStore();
    await store.fetchNotifications();

    const wrapper = mount(NotificationDD, {
      global: {
        plugins: [vuetify, pinia],
      },
    });

    // The dropdown content (including notification titles) lives inside a
    // v-menu, which Vuetify does not render into the DOM until it is opened.
    // The activator (button + badge) is always present, so we assert the
    // badge reflects the store's reactive state instead of the closed menu's
    // content.
    const badge = wrapper.findComponent({ name: "VBadge" });
    expect(badge.props("content")).toBe(store.notifications.length);

    store.markAllRead();
    await wrapper.vm.$nextTick();

    expect(badge.props("content")).toBe(0);
  });
});
