import { describe, expect, it } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import RevenueRegion from "@/views/dashboard/components/RevenueRegion.vue";

const apexchartStub = {
  name: "ApexchartStub",
  props: ["options", "series"],
  template: "<div/>",
};

describe("RevenueRegion", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithPlugins(RevenueRegion, {
        global: { stubs: { apexchart: apexchartStub } },
      }),
    ).not.toThrow();
  });

  it("passes chart options with the expected foreColor, colors, tooltip formatter, and labels", () => {
    const wrapper = mountWithPlugins(RevenueRegion, {
      global: { stubs: { apexchart: apexchartStub } },
    });

    const chart = wrapper.findComponent({ name: "ApexchartStub" });
    expect(chart.exists()).toBe(true);

    const options = chart.props("options") as any;

    // Note: unlike RevenueTrend, this component hardcodes foreColor rather than
    // deriving it from the theme.
    expect(options.chart.foreColor).toBe("#a1aab2");

    expect(options.colors).toHaveLength(1);
    expect(typeof options.colors[0]).toBe("string");
    expect(options.colors[0].startsWith("#")).toBe(true);

    expect(typeof options.tooltip.y.formatter).toBe("function");
    expect(options.tooltip.y.formatter(1000)).toBe("1,000");

    expect(Array.isArray(options.labels)).toBe(true);
  });
});
