import { describe, expect, it } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import WidgetFive from "@/views/dashboard/components/WidgetFive.vue";

describe("WidgetFive", () => {
  it("renders a KPI card for each entry returned by the store", async () => {
    const wrapper = mountWithPlugins(WidgetFive);

    // Let the dashboard store's auto-fetch (triggered on store creation) resolve.
    await flushPromises();
    await flushPromises();

    const cards = wrapper.findAll(".text-h6.text-lightText");
    expect(cards.length).toBe(4);

    const text = wrapper.text();
    expect(text).toContain("Revenue");
    expect(text).toContain("Active Business Units");
    expect(text).toContain("Transactions");
    expect(text).toContain("Completion Rate");
  });
});
