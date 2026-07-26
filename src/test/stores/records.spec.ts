import { HttpResponse, http } from "msw";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "@/test/setup";
import { useRecordsStore } from "@/stores/records";

const baseQuery = {
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  search: "",
};

describe("useRecordsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("fetches records and populates items/total", async () => {
    const store = useRecordsStore();
    await store.fetchRecords(baseQuery);

    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.items.length).toBeGreaterThan(0);
    expect(store.total).toBeGreaterThan(0);
  });

  it("skips refetching for an identical query", async () => {
    const store = useRecordsStore();
    await store.fetchRecords(baseQuery);
    const firstItems = store.items;

    await store.fetchRecords({ ...baseQuery });

    expect(store.items).toBe(firstItems);
  });

  it("refetches when the query changes", async () => {
    let requestCount = 0;
    server.use(
      http.get("/api/records", ({ request }) => {
        requestCount += 1;
        const url = new URL(request.url);
        return HttpResponse.json({
          items: [],
          total: 0,
          page: url.searchParams.get("page"),
        });
      }),
    );

    const store = useRecordsStore();
    await store.fetchRecords(baseQuery);
    await store.fetchRecords({ ...baseQuery, page: 2 });

    expect(requestCount).toBe(2);
  });

  it("sends search, sort, and filter params in the request", async () => {
    const captured: { url: URL | null } = { url: null };
    server.use(
      http.get("/api/records", ({ request }) => {
        captured.url = new URL(request.url);
        return HttpResponse.json({ items: [], total: 0 });
      }),
    );

    const store = useRecordsStore();
    await store.fetchRecords({
      ...baseQuery,
      search: "Acme",
      sortBy: [{ key: "revenue", order: "desc" }],
      region: ["Europe", "Asia Pacific"],
      status: ["Completed"],
      fromDate: new Date(2026, 0, 1),
      toDate: new Date(2026, 5, 1),
    });

    expect(captured.url?.searchParams.get("search")).toBe("Acme");
    expect(captured.url?.searchParams.get("sortBy")).toBe("revenue");
    expect(captured.url?.searchParams.get("sortOrder")).toBe("desc");
    expect(captured.url?.searchParams.getAll("region")).toEqual([
      "Europe",
      "Asia Pacific",
    ]);
    expect(captured.url?.searchParams.getAll("status")).toEqual(["Completed"]);
  });

  it("sets loading while the request is in flight", async () => {
    const store = useRecordsStore();
    const promise = store.fetchRecords(baseQuery);

    expect(store.loading).toBe(true);
    await promise;
    expect(store.loading).toBe(false);
  });

  it("records an error message when the request fails", async () => {
    server.use(
      http.get("/api/records", () => new HttpResponse(null, { status: 500 })),
    );

    const store = useRecordsStore();
    await store.fetchRecords(baseQuery);

    expect(store.loading).toBe(false);
    expect(store.error).toContain("failed");
  });
});
