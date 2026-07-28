import { describe, expect, it } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
// BarChartCard lives under components/shared, not views/dashboard/components.
import BarChartCard from "@/components/shared/BarChartCard.vue";

const apexchartStub = {
  name: "ApexchartStub",
  props: ["options", "series"],
  template: "<div/>",
};

const props = {
  title: "Revenue by Region",
  labels: ["Europe", "Asia Pacific"],
  series: [100, 200],
};

describe("BarChartCard", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithPlugins(BarChartCard, {
        props,
        global: { stubs: { apexchart: apexchartStub } },
      }),
    ).not.toThrow();
  });

  it("renders the given title", () => {
    const wrapper = mountWithPlugins(BarChartCard, {
      props,
      global: { stubs: { apexchart: apexchartStub } },
    });

    expect(wrapper.text()).toContain("Revenue by Region");
  });

  it("passes chart options with the expected foreColor, colors, tooltip formatter, and labels", () => {
    const wrapper = mountWithPlugins(BarChartCard, {
      props,
      global: { stubs: { apexchart: apexchartStub } },
    });

    const chart = wrapper.findComponent({ name: "ApexchartStub" });
    expect(chart.exists()).toBe(true);

    const options = chart.props("options") as any;

    expect(options.chart.foreColor).toBe("#a1aab2");

    expect(options.colors).toHaveLength(1);
    expect(typeof options.colors[0]).toBe("string");
    expect(options.colors[0].startsWith("#")).toBe(true);

    expect(typeof options.tooltip.y.formatter).toBe("function");
    expect(options.tooltip.y.formatter(1000)).toBe("1,000");

    expect(Array.isArray(options.labels)).toBe(true);
  });
});
