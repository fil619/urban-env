import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { VApp } from "vuetify/components";
import { createPinia, setActivePinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import { useConfigStore } from "@/stores/config";
import HeaderBar from "@/components/header/HeaderBar.vue";

// VAppBar requires a surrounding v-app to provide its layout injection,
// so HeaderBar is mounted inside a minimal v-app host component. VApp must
// be registered explicitly here since Vuetify's auto-import only rewrites
// real .vue SFCs, not this inline defineComponent template.
const HeaderBarHost = defineComponent({
  components: { VApp, HeaderBar },
  template: `<v-app><HeaderBar /></v-app>`,
});

describe("HeaderBar", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("toggles mini sidebar and sidebar state when the buttons are clicked", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const customizer = useConfigStore();

    expect(customizer.miniSidebar).toBe(false);
    expect(customizer.sidebar).toBe(true);

    const wrapper = mount(HeaderBarHost, {
      global: {
        plugins: [vuetify, pinia],
        stubs: { NotificationDD: true },
      },
    });

    const buttons = wrapper.findAllComponents({ name: "VBtn" });
    expect(buttons.length).toBe(2);

    await buttons[0].trigger("click");
    expect(customizer.miniSidebar).toBe(true);

    await buttons[1].trigger("click");
    expect(customizer.sidebar).toBe(false);
  });
});
