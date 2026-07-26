import { describe, expect, it } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import RevenueBusinessUnit from "@/views/dashboard/components/RevenueBusinessUnit.vue";

const apexchartStub = {
  name: "ApexchartStub",
  props: ["options", "series"],
  template: "<div/>",
};

describe("RevenueBusinessUnit", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithPlugins(RevenueBusinessUnit, {
        global: { stubs: { apexchart: apexchartStub } },
      }),
    ).not.toThrow();
  });

  it("passes chart options with the expected foreColor, colors, tooltip formatter, and labels", () => {
    const wrapper = mountWithPlugins(RevenueBusinessUnit, {
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
