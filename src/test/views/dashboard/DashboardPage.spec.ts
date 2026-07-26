import { createPinia, setActivePinia, type Pinia } from "pinia";
import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import { nextTick } from "vue";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import vuetifyInstance from "@/plugins/vuetify";
import DashboardPage from "@/views/dashboard/DashboardPage.vue";
import { useDashboardStore } from "@/stores/dashboard";

const stubs = {
  WidgetFive: true,
  RevenueTrend: true,
  RevenueRegion: true,
  RecentOrder: true,
};

function mountPage(pinia: Pinia) {
  return mount(DashboardPage, {
    global: {
      plugins: [vuetifyInstance, pinia],
      stubs,
    },
  });
}

describe("DashboardPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches regions on mount and passes them to tool-bar", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const toolBar = wrapper.findComponent({ name: "ToolBar" });
    expect(toolBar.exists()).toBe(true);

    const regions = toolBar.props("regions") as { id: number; name: string }[];
    expect(Array.isArray(regions)).toBe(true);
    expect(regions.length).toBeGreaterThan(0);
    expect(regions[0]).toHaveProperty("id");
    expect(regions[0]).toHaveProperty("name");
  });

  it("passes noFiltersSelected=true to tool-bar initially", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const toolBar = wrapper.findComponent({ name: "ToolBar" });
    expect(toolBar.props("noFiltersSelected")).toBe(true);
  });

  it("marks the date range invalid when toDate precedes fromDate", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const toolBar = wrapper.findComponent({ name: "ToolBar" });
    toolBar.vm.$emit("update:fromDate", new Date(2026, 5, 1));
    toolBar.vm.$emit("update:toDate", new Date(2026, 0, 1));
    await nextTick();

    expect(toolBar.props("dateRangeInvalid")).toBe(true);
  });

  it("resets filters back to noFiltersSelected=true when clear is emitted", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const toolBar = wrapper.findComponent({ name: "ToolBar" });
    toolBar.vm.$emit("update:fromDate", new Date(2026, 5, 1));
    toolBar.vm.$emit("update:toDate", new Date(2026, 0, 1));
    await nextTick();
    expect(toolBar.props("noFiltersSelected")).toBe(false);

    toolBar.vm.$emit("clear");
    await nextTick();

    expect(toolBar.props("noFiltersSelected")).toBe(true);
    expect(toolBar.props("dateRangeInvalid")).toBe(false);
  });

  it("triggers a fetch to the filtered-records endpoint when apply is emitted", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const fetchSpy = vi.spyOn(globalThis, "fetch");
    expect(fetchSpy).not.toHaveBeenCalled();

    const toolBar = wrapper.findComponent({ name: "ToolBar" });
    toolBar.vm.$emit("apply");
    await flushPromises();

    expect(
      fetchSpy.mock.calls.some((call) =>
        String(call[0]).includes("/api/records/recent"),
      ),
    ).toBe(true);
  });

  it("shows the dashboard store error and retries the fetch on button click", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    server.use(
      http.get("/api/dashboard/kpis", () => new HttpResponse(null, { status: 500 })),
    );

    const store = useDashboardStore();
    await store.fetchDashboardData();
    expect(store.loaded).toBe(false);
    expect(store.error).toBeTruthy();

    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    expect(wrapper.text()).toContain(store.error as string);

    const retryButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Retry"));
    expect(retryButton).toBeTruthy();

    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await retryButton!.trigger("click");
    await flushPromises();

    expect(
      fetchSpy.mock.calls.some((call) =>
        String(call[0]).includes("/api/dashboard/kpis"),
      ),
    ).toBe(true);
  });
});
