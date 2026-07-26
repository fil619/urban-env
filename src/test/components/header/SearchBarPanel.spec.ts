import { describe, it, expect } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import SearchBarPanel from "@/components/header/SearchBarPanel.vue";

describe("SearchBarPanel", () => {
  it("renders a magnify icon without throwing", () => {
    const wrapper = mountWithPlugins(SearchBarPanel);

    const icon = wrapper.findComponent({ name: "VIcon" });
    expect(icon.props("icon")).toBe("mdi-magnify");
  });
});
