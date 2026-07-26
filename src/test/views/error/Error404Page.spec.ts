import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import vuetifyInstance from "@/plugins/vuetify";
import Error404Page from "@/views/error/Error404Page.vue";

describe("Error404Page", () => {
  it("renders the 404 message and a link back home", () => {
    const wrapper = mount(Error404Page, {
      global: {
        plugins: [vuetifyInstance],
        stubs: {
          RouterLink: true,
          Logo: true,
        },
      },
    });

    expect(wrapper.text()).toContain("404");
    expect(wrapper.text()).toContain("Page Not Found");
    expect(wrapper.text()).toContain("Back to Home");
  });
});
