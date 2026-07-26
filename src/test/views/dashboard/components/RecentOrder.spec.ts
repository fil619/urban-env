import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import vuetify from "@/plugins/vuetify";
import { useDashboardStore } from "@/stores/dashboard";
import RecentOrder from "@/views/dashboard/components/RecentOrder.vue";

describe("RecentOrder", () => {
  it("renders the correct status label for completed, processing, and other statuses", () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const store = useDashboardStore();
    store.recentRecords = [
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
      global: {
        plugins: [vuetify, pinia],
        stubs: { RouterLink: true },
      },
    });

    const text = wrapper.text();
    expect(text).toContain("Completed");
    expect(text).toContain("Processing");
    expect(text).toContain("Pending");
  });
});
