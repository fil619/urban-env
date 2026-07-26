import { describe, expect, it } from "vitest";
import { mountWithPlugins } from "@/test/mountWithPlugins";
import ToolBar from "@/views/dashboard/components/ToolBar.vue";

const regions = [
  { id: 1, name: "North America" },
  { id: 2, name: "Europe" },
];

function mountToolBar(props: {
  noFiltersSelected: boolean;
  dateRangeInvalid: boolean;
}) {
  return mountWithPlugins(ToolBar, {
    props: {
      regions,
      ...props,
    },
  });
}

describe("ToolBar", () => {
  it("disables Apply when noFiltersSelected is true", () => {
    const wrapper = mountToolBar({
      noFiltersSelected: true,
      dateRangeInvalid: false,
    });

    const applyBtn = wrapper
      .findAll("button")
      .find((btn) => btn.text() === "Apply");

    expect(applyBtn).toBeTruthy();
    expect(applyBtn!.attributes("disabled")).not.toBeUndefined();
  });

  it("disables Apply when dateRangeInvalid is true", () => {
    const wrapper = mountToolBar({
      noFiltersSelected: false,
      dateRangeInvalid: true,
    });

    const applyBtn = wrapper
      .findAll("button")
      .find((btn) => btn.text() === "Apply");

    expect(applyBtn).toBeTruthy();
    expect(applyBtn!.attributes("disabled")).not.toBeUndefined();
  });

  it("enables Apply when both noFiltersSelected and dateRangeInvalid are false", () => {
    const wrapper = mountToolBar({
      noFiltersSelected: false,
      dateRangeInvalid: false,
    });

    const applyBtn = wrapper
      .findAll("button")
      .find((btn) => btn.text() === "Apply");

    expect(applyBtn).toBeTruthy();
    expect(applyBtn!.attributes("disabled")).toBeUndefined();
  });

  it("emits 'apply' when Apply is clicked and enabled", async () => {
    const wrapper = mountToolBar({
      noFiltersSelected: false,
      dateRangeInvalid: false,
    });

    const applyBtn = wrapper
      .findAll("button")
      .find((btn) => btn.text() === "Apply");

    await applyBtn!.trigger("click");

    expect(wrapper.emitted("apply")).toBeTruthy();
  });

  it.each([
    { noFiltersSelected: true, dateRangeInvalid: false },
    { noFiltersSelected: false, dateRangeInvalid: true },
    { noFiltersSelected: false, dateRangeInvalid: false },
  ])(
    "emits 'clear' when Clear is clicked regardless of prop state (%o)",
    async (props) => {
      const wrapper = mountToolBar(props);

      const clearBtn = wrapper
        .findAll("button")
        .find((btn) => btn.text() === "Clear");

      await clearBtn!.trigger("click");

      expect(wrapper.emitted("clear")).toBeTruthy();
    },
  );

  it("passes the regions prop through to the region v-select's items", () => {
    const wrapper = mountToolBar({
      noFiltersSelected: false,
      dateRangeInvalid: false,
    });

    const selects = wrapper.findAllComponents({ name: "VSelect" });
    const itemsProps = selects.map((select) => select.props("items"));

    expect(itemsProps).toContainEqual(regions);
  });

  it("passes a validation rule that reports the date range error when dateRangeInvalid is true", () => {
    const wrapper = mountToolBar({
      noFiltersSelected: false,
      dateRangeInvalid: true,
    });

    const dateInputs = wrapper.findAllComponents({ name: "VDateInput" });
    expect(dateInputs.length).toBe(2);

    for (const dateInput of dateInputs) {
      const rules = dateInput.props("rules") as Array<() => unknown>;
      expect(Array.isArray(rules)).toBe(true);
      const results = rules.map((rule) => rule());
      expect(results).toContain("Start date must not be after end date");
    }
  });

  it("passes a validation rule that reports no error when dateRangeInvalid is false", () => {
    const wrapper = mountToolBar({
      noFiltersSelected: false,
      dateRangeInvalid: false,
    });

    const dateInputs = wrapper.findAllComponents({ name: "VDateInput" });
    expect(dateInputs.length).toBe(2);

    for (const dateInput of dateInputs) {
      const rules = dateInput.props("rules") as Array<() => unknown>;
      const results = rules.map((rule) => rule());
      expect(results).not.toContain("Start date must not be after end date");
      expect(results.every((result) => result !== false)).toBe(true);
    }
  });
});
