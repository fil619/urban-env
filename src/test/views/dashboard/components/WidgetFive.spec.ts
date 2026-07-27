import { describe, expect, it } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import WidgetFive from "@/views/dashboard/components/WidgetFive.vue";
import type { KpiCard } from "@/stores/dashboard";

const kpis: KpiCard[] = [
  {
    name: "Revenue",
    earn: "£10,000",
    percent: "+12%",
    color: "success",
    icon: "mdi-cash",
    text: "vs last month",
  },
  {
    name: "Active Business Units",
    earn: "5",
    percent: "+1",
    color: "primary",
    icon: "mdi-domain",
    text: "vs last month",
  },
  {
    name: "Transactions",
    earn: "1,200",
    percent: "+8%",
    color: "info",
    icon: "mdi-swap-horizontal",
    text: "vs last month",
  },
  {
    name: "Completion Rate",
    earn: "92%",
    percent: "+2%",
    color: "success",
    icon: "mdi-check-circle",
    text: "vs last month",
  },
];

describe("WidgetFive", () => {
  it("renders a KPI card for each entry passed in", () => {
    const wrapper = mountWithPlugins(WidgetFive, { props: { kpis } });

    const cards = wrapper.findAll(".text-h6.text-lightText");
    expect(cards.length).toBe(4);

    const text = wrapper.text();
    expect(text).toContain("Revenue");
    expect(text).toContain("Active Business Units");
    expect(text).toContain("Transactions");
    expect(text).toContain("Completion Rate");
  });
});
