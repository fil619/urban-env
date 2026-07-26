import { describe, expect, it } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import OrderStatus from "@/views/dashboard/components/OrderStatus.vue";

const apexchartStub = {
  name: "ApexchartStub",
  props: ["options", "series"],
  template: "<div/>",
};

describe("OrderStatus", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithPlugins(OrderStatus, {
        global: { stubs: { apexchart: apexchartStub } },
      }),
    ).not.toThrow();
  });

  it("passes donut chart options with one color per status, a tooltip formatter, and labels", () => {
    const wrapper = mountWithPlugins(OrderStatus, {
      global: { stubs: { apexchart: apexchartStub } },
    });

    const chart = wrapper.findComponent({ name: "ApexchartStub" });
    expect(chart.exists()).toBe(true);

    const options = chart.props("options") as any;

    expect(options.chart.type).toBe("donut");
    expect(options.colors).toHaveLength(3);
    options.colors.forEach((color: string) => {
      expect(color.startsWith("#")).toBe(true);
    });

    expect(typeof options.tooltip.y.formatter).toBe("function");
    expect(options.tooltip.y.formatter(1000)).toBe("1,000");

    expect(Array.isArray(options.labels)).toBe(true);
    expect(options.legend.show).toBe(true);
  });
});
