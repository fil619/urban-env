import { HttpResponse, http } from "msw";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "@/test/setup";
import { useDashboardStore } from "@/stores/dashboard";

describe("useDashboardStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("loads dashboard data on creation", async () => {
    const store = useDashboardStore();
    await store.fetchDashboardData();

    expect(store.loaded).toBe(true);
    expect(store.error).toBeNull();
    expect(store.kpis.length).toBeGreaterThan(0);
    expect(store.revenueTrend.length).toBeGreaterThan(0);
    expect(store.revenueTrendLabels.length).toBe(store.revenueTrend.length);
    expect(store.revenueByRegion.length).toBeGreaterThan(0);
    expect(store.recentRecords.length).toBeGreaterThan(0);
  });

  it("does not refetch once loaded", async () => {
    const store = useDashboardStore();
    await store.fetchDashboardData();
    const firstKpis = store.kpis;

    await store.fetchDashboardData();

    expect(store.kpis).toBe(firstKpis);
  });

  it("records an error when any dashboard request fails", async () => {
    server.use(
      http.get("/api/dashboard/kpis", () => new HttpResponse(null, { status: 500 })),
    );

    const store = useDashboardStore();
    await store.fetchDashboardData();

    expect(store.loaded).toBe(false);
    expect(store.error).toContain("failed");
  });

  it("fetchFilteredData sends filters as query params and updates state", async () => {
    const captured: { url: URL | null } = { url: null };
    server.use(
      http.get("/api/records/recent", ({ request }) => {
        captured.url = new URL(request.url);
        return HttpResponse.json([]);
      }),
    );

    const store = useDashboardStore();
    await store.fetchDashboardData();

    await store.fetchFilteredData({
      fromDate: new Date(2026, 0, 1),
      toDate: new Date(2026, 5, 1),
      region: "Europe",
      status: "Completed",
    });

    expect(store.error).toBeNull();
    expect(store.recentRecords).toEqual([]);
    expect(captured.url?.searchParams.get("region")).toBe("Europe");
    expect(captured.url?.searchParams.get("status")).toBe("Completed");
    expect(captured.url?.searchParams.get("fromDate")).toBeTruthy();
    expect(captured.url?.searchParams.get("toDate")).toBeTruthy();
  });

  it("fetchFilteredData omits unset filters from the query", async () => {
    const captured: { url: URL | null } = { url: null };
    server.use(
      http.get("/api/records/recent", ({ request }) => {
        captured.url = new URL(request.url);
        return HttpResponse.json([]);
      }),
    );

    const store = useDashboardStore();
    await store.fetchDashboardData();
    await store.fetchFilteredData();

    expect(captured.url?.searchParams.has("region")).toBe(false);
    expect(captured.url?.searchParams.has("status")).toBe(false);
    expect(captured.url?.searchParams.has("fromDate")).toBe(false);
    expect(captured.url?.searchParams.has("toDate")).toBe(false);
  });

  it("records an error when fetchFilteredData fails", async () => {
    server.use(
      http.get("/api/records/recent", () => new HttpResponse(null, { status: 500 })),
    );

    const store = useDashboardStore();
    await store.fetchDashboardData();
    await store.fetchFilteredData({ region: "Europe" });

    expect(store.error).toContain("failed");
  });
});
