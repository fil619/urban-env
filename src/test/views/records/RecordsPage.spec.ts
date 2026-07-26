import { createPinia, setActivePinia, type Pinia } from "pinia";
import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, afterEach } from "vitest";
import vuetifyInstance from "@/plugins/vuetify";
import RecordsPage from "@/views/records/RecordsPage.vue";

const mountPage = (pinia: Pinia) => {
  return mount(RecordsPage, {
    global: {
      plugins: [vuetifyInstance, pinia],
    },
  });
};

const fetchUrls = (fetchSpy: ReturnType<typeof vi.spyOn>): string[] => {
  return (fetchSpy.mock.calls as unknown[][]).map((call) => String(call[0]));
};

describe("RecordsPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("passes noFiltersSelected=true to tool-bar initially", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const toolBar = wrapper.findComponent({ name: "ToolBar" });
    expect(toolBar.exists()).toBe(true);
    expect(toolBar.props("noFiltersSelected")).toBe(true);
    expect(toolBar.props("dateRangeInvalid")).toBe(false);
  });

  it("fetches /api/records when the data table emits update:options", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const dataTable = wrapper.findComponent({ name: "VDataTableServer" });
    expect(dataTable.exists()).toBe(true);

    dataTable.vm.$emit("update:options", {
      page: 2,
      itemsPerPage: 10,
      sortBy: [],
      search: "",
    });
    await flushPromises();

    expect(
      fetchUrls(fetchSpy).some((url) => url.includes("/api/records")),
    ).toBe(true);
  });

  it("re-fetches /api/records when apply is emitted after options were loaded", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const dataTable = wrapper.findComponent({ name: "VDataTableServer" });
    dataTable.vm.$emit("update:options", {
      page: 2,
      itemsPerPage: 10,
      sortBy: [],
      search: "",
    });
    await flushPromises();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const toolBar = wrapper.findComponent({ name: "ToolBar" });
    toolBar.vm.$emit("apply");
    await flushPromises();

    const recordsCalls = fetchUrls(fetchSpy).filter((url) =>
      url.includes("/api/records"),
    );
    expect(recordsCalls.length).toBeGreaterThan(0);
  });

  it("does not fetch /api/records when apply is emitted before any options were loaded", async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mountPage(pinia);
    await flushPromises();
    await flushPromises();

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const toolBar = wrapper.findComponent({ name: "ToolBar" });
    toolBar.vm.$emit("apply");
    await flushPromises();

    expect(
      fetchUrls(fetchSpy).some((url) => url.includes("/api/records")),
    ).toBe(false);
  });
});
