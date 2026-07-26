import { describe, expect, it } from "vitest";
import { businessUnits, records, regions, statuses } from "@/mocks/generateRecords";

describe("mock API handlers", () => {
  it("GET /api/records paginates results", async () => {
    const res = await fetch("/api/records?page=1&itemsPerPage=10");
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.items).toHaveLength(10);
    expect(body.total).toBe(records.length);
  });

  it("GET /api/records returns all items when itemsPerPage is -1", async () => {
    const res = await fetch("/api/records?page=1&itemsPerPage=-1");
    const body = await res.json();

    expect(body.items).toHaveLength(records.length);
  });

  it("GET /api/records filters by region and status", async () => {
    const target = records[0];
    const res = await fetch(
      `/api/records?page=1&itemsPerPage=-1&region=${encodeURIComponent(target.region)}&status=${target.status}`,
    );
    const body = await res.json();

    expect(body.items.length).toBeGreaterThan(0);
    for (const item of body.items) {
      expect(item.region).toBe(target.region);
      expect(item.status).toBe(target.status);
    }
  });

  it("GET /api/records filters by multiple regions and statuses", async () => {
    const [first, second] = records;
    const params = new URLSearchParams({ page: "1", itemsPerPage: "-1" });
    params.append("region", first.region);
    params.append("region", second.region);
    params.append("status", first.status);
    params.append("status", second.status);

    const res = await fetch(`/api/records?${params.toString()}`);
    const body = await res.json();

    expect(body.items.length).toBeGreaterThan(0);
    for (const item of body.items) {
      expect([first.region, second.region]).toContain(item.region);
      expect([first.status, second.status]).toContain(item.status);
    }
  });

  it("GET /api/records searches across fields", async () => {
    const target = records[0];
    const res = await fetch(
      `/api/records?page=1&itemsPerPage=-1&search=${encodeURIComponent(target.businessUnit)}`,
    );
    const body = await res.json();

    expect(body.items.length).toBeGreaterThan(0);
    for (const item of body.items) {
      expect(item.businessUnit).toBe(target.businessUnit);
    }
  });

  it("GET /api/records sorts by the requested field and order", async () => {
    const res = await fetch(
      "/api/records?page=1&itemsPerPage=-1&sortBy=transactions&sortOrder=desc",
    );
    const body = await res.json();

    const transactions = body.items.map((i: { transactions: number }) => i.transactions);
    const sorted = [...transactions].sort((a, b) => b - a);
    expect(transactions).toEqual(sorted);
  });

  it("GET /api/records/recent returns at most 10 items", async () => {
    const res = await fetch("/api/records/recent");
    const body = await res.json();

    expect(body.length).toBeLessThanOrEqual(10);
  });

  it("GET /api/dashboard/kpis returns four summary cards", async () => {
    const res = await fetch("/api/dashboard/kpis");
    const body = await res.json();

    expect(body).toHaveLength(4);
    expect(body.map((c: { name: string }) => c.name)).toEqual([
      "Revenue",
      "Active Business Units",
      "Transactions",
      "Completion Rate",
    ]);
  });

  it("GET /api/dashboard/revenue-by-region returns one entry per region", async () => {
    const res = await fetch("/api/dashboard/revenue-by-region");
    const body = await res.json();

    expect(body.labels).toEqual(regions.map((r) => r.name));
    expect(body.data).toHaveLength(regions.length);
  });

  it("GET /api/dashboard/revenue-trend returns matching labels and data lengths", async () => {
    const res = await fetch("/api/dashboard/revenue-trend");
    const body = await res.json();

    expect(body.labels.length).toBe(body.data.length);
    expect(body.labels.length).toBeGreaterThan(0);
  });

  it("GET /api/dashboard/revenue-by-business-unit returns one entry per business unit", async () => {
    const res = await fetch("/api/dashboard/revenue-by-business-unit");
    const body = await res.json();

    expect(body.labels).toEqual(businessUnits.map((u) => u.name));
    expect(body.data).toHaveLength(businessUnits.length);
  });

  it("GET /api/dashboard/order-status returns one count per status", async () => {
    const res = await fetch("/api/dashboard/order-status");
    const body = await res.json();

    expect(body.labels).toEqual(
      statuses.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    );
    expect(body.data).toHaveLength(statuses.length);
    expect(body.data.reduce((sum: number, n: number) => sum + n, 0)).toBe(
      records.length,
    );
  });

  it("GET /api/dashboard/order-status filters by region", async () => {
    const target = records[0];
    const res = await fetch(
      `/api/dashboard/order-status?region=${encodeURIComponent(target.region)}`,
    );
    const body = await res.json();

    const expectedTotal = records.filter(
      (record) => record.region === target.region,
    ).length;

    expect(body.data.reduce((sum: number, n: number) => sum + n, 0)).toBe(
      expectedTotal,
    );
  });

  it("GET /api/notifications returns a notification list", async () => {
    const res = await fetch("/api/notifications");
    const body = await res.json();

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  it("GET /api/regions returns the known region list", async () => {
    const res = await fetch("/api/regions");
    const body = await res.json();

    expect(body).toEqual(regions);
  });
});
