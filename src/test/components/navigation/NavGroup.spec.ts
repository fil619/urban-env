import { describe, it, expect } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import NavGroup from "@/components/navigation/NavGroup.vue";
import type { MenuItem } from "@/types/menu";

describe("NavGroup", () => {
  it("renders the header text", () => {
    const item: MenuItem = { header: "Some Section" };

    const wrapper = mountWithPlugins(NavGroup, {
      props: { item },
    });

    expect(wrapper.text()).toContain("Some Section");
  });
});
