import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useConfigStore } from "@/stores/config";

describe("useConfigStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("defaults sidebar open and mini-sidebar closed", () => {
    const store = useConfigStore();
    expect(store.sidebar).toBe(true);
    expect(store.miniSidebar).toBe(false);
  });

  it("toggleSidebar flips sidebar", () => {
    const store = useConfigStore();
    store.toggleSidebar();
    expect(store.sidebar).toBe(false);
    store.toggleSidebar();
    expect(store.sidebar).toBe(true);
  });

  it("toggleMiniSidebar flips miniSidebar", () => {
    const store = useConfigStore();
    store.toggleMiniSidebar();
    expect(store.miniSidebar).toBe(true);
    store.toggleMiniSidebar();
    expect(store.miniSidebar).toBe(false);
  });
});
