import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import vuetify from "@/plugins/vuetify";
import type { RecordItem } from "@/stores/dashboard";
import RecentOrder from "@/views/dashboard/components/RecentOrder.vue";

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

  it("renders records as cards instead of a table on mobile", () => {
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

    const wrapper = mount(RecentOrder, {
      props: { records },
      global: {
        plugins: [
          vuetify,
          {
            install(app) {
              app.config.globalProperties.$vuetify.display.mobile = true;
            },
          },
        ],
        stubs: { RouterLink: true },
      },
    });

    expect(wrapper.findComponent({ name: "VDataIterator" }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: "VTable" }).exists()).toBe(false);
    expect(wrapper.text()).toContain("Retail Banking");
  });
});
