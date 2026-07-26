import { describe, it, expect } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import NavItem from "@/components/navigation/NavItem.vue";
import type { MenuItem } from "@/types/menu";

describe("NavItem", () => {
  it("renders an internal item with a `to` prop and no href", () => {
    const item: MenuItem = { title: "Dashboard", to: "/dashboard" };

    const wrapper = mountWithPlugins(NavItem, {
      props: { item },
    });

    const listItem = wrapper.findComponent({ name: "VListItem" });
    expect(listItem.props("to")).toBe("/dashboard");
    expect(listItem.props("href")).toBe("");
  });

  it("renders an external item with an href and target=_blank", () => {
    const item: MenuItem = {
      title: "External",
      type: "external",
      to: "https://example.com",
    };

    const wrapper = mountWithPlugins(NavItem, {
      props: { item },
    });

    const listItem = wrapper.findComponent({ name: "VListItem" });
    expect(listItem.props("href")).toBe("https://example.com");
    expect(listItem.attributes("target")).toBe("_blank");
  });

  it("disables the list item when item.disabled is true", () => {
    const item: MenuItem = { title: "Disabled Item", to: "/x", disabled: true };

    const wrapper = mountWithPlugins(NavItem, {
      props: { item },
    });

    const listItem = wrapper.findComponent({ name: "VListItem" });
    expect(listItem.props("disabled")).toBe(true);
  });

  it("renders the subCaption text when set", () => {
    const item: MenuItem = {
      title: "With Caption",
      to: "/x",
      subCaption: "A helpful caption",
    };

    const wrapper = mountWithPlugins(NavItem, {
      props: { item },
    });

    expect(wrapper.text()).toContain("A helpful caption");
  });

  it("does not render a subtitle when subCaption is not set", () => {
    const item: MenuItem = { title: "No Caption", to: "/x" };

    const wrapper = mountWithPlugins(NavItem, {
      props: { item },
    });

    expect(wrapper.findComponent({ name: "VListItemSubtitle" }).exists()).toBe(
      false,
    );
  });

  it("renders a chip with the chip text when item.chip is set", () => {
    const item: MenuItem = {
      title: "Chipped",
      to: "/x",
      chip: "New",
      chipColor: "primary",
    };

    const wrapper = mountWithPlugins(NavItem, {
      props: { item },
    });

    expect(wrapper.text()).toContain("New");
  });

  it("does not render a chip when item.chip is not set", () => {
    const item: MenuItem = { title: "No Chip", to: "/x" };

    const wrapper = mountWithPlugins(NavItem, {
      props: { item },
    });

    expect(wrapper.findComponent({ name: "VChip" }).exists()).toBe(false);
  });
});
