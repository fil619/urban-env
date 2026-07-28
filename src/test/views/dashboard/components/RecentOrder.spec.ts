import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import vuetify from "@/plugins/vuetify";
import type { RecordItem } from "@/stores/dashboard";
import RecentOrder from "@/views/dashboard/components/RecentOrder.vue";

// Vuetify 4 derives display.mobile reactively from window.innerWidth instead of
// exposing a patchable $vuetify.display global, so mobile state must be forced
// via an actual resize.
const setWindowWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

describe("RecentOrder", () => {
  it("renders the correct status label for completed, processing, and other statuses", () => {
    const records: RecordItem[] = [
      {
        date: "01/01/2026",
        businessUnit: "Retail Banking",
        region: "Europe",
        revenue: "£1,000",
        transactions: 5,
        status: "completed",
      },
      {
        date: "02/01/2026",
        businessUnit: "Corporate Banking",
        region: "Africa",
        revenue: "£2,000",
        transactions: 3,
        status: "processing",
      },
      {
        date: "03/01/2026",
        businessUnit: "Insurance",
        region: "Asia Pacific",
        revenue: "£3,000",
        transactions: 1,
        status: "pending",
      },
    ];

    const wrapper = mount(RecentOrder, {
      props: { records },
      global: {
        plugins: [vuetify],
        stubs: { RouterLink: true },
      },
    });

    const text = wrapper.text();
    expect(text).toContain("Completed");
    expect(text).toContain("Processing");
    expect(text).toContain("Pending");
  });

  it("renders records as cards instead of a table on mobile", async () => {
    const records: RecordItem[] = [
      {
        date: "01/01/2026",
        businessUnit: "Retail Banking",
        region: "Europe",
        revenue: "£1,000",
        transactions: 5,
        status: "completed",
      },
    ];

    const originalWidth = window.innerWidth;
    setWindowWidth(500);
    await nextTick();

    const wrapper = mount(RecentOrder, {
      props: { records },
      global: {
        plugins: [vuetify],
        stubs: { RouterLink: true },
      },
    });

    expect(wrapper.findComponent({ name: "VDataIterator" }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: "VTable" }).exists()).toBe(false);
    expect(wrapper.text()).toContain("Retail Banking");

    setWindowWidth(originalWidth);
    await nextTick();
  });
});
