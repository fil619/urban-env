import { describe, expect, it } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import RevenueTrend from "@/views/dashboard/components/RevenueTrend.vue";

const apexchartStub = {
  name: "ApexchartStub",
  props: ["options", "series"],
  template: "<div/>",
};

describe("RevenueTrend", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithPlugins(RevenueTrend, {
        global: { stubs: { apexchart: apexchartStub } },
      }),
    ).not.toThrow();
  });

  it("passes chart options with the expected foreColor, tooltip formatter, and colors", () => {
    const wrapper = mountWithPlugins(RevenueTrend, {
      global: { stubs: { apexchart: apexchartStub } },
    });

    const chart = wrapper.findComponent({ name: "ApexchartStub" });
    expect(chart.exists()).toBe(true);

    const options = chart.props("options") as any;

    expect(options.chart.foreColor).toBe(
      "rgba(var(--v-theme-secondary), var(--v-high-opacity))",
    );
    expect(typeof options.tooltip.y.formatter).toBe("function");
    expect(options.tooltip.y.formatter(12345)).toBe("12,345");
    expect(options.colors).toHaveLength(2);
  });
});
