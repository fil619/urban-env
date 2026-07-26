import { describe, expect, it } from "vitest";
import { businessUnits, records, regions } from "@/mocks/generateRecords";

describe("generateRecords data", () => {
  it("generates the expected number of records", () => {
    expect(records).toHaveLength(200);
  });

  it("assigns sequential unique ids starting at 1", () => {
    expect(records[0].id).toBe(1);
    expect(records[records.length - 1].id).toBe(200);
    expect(new Set(records.map((r) => r.id)).size).toBe(records.length);
  });

  it("only uses known business units and regions", () => {
    const validBusinessUnits = new Set(businessUnits.map((b) => b.name));
    const validRegions = new Set(regions.map((r) => r.name));

    for (const record of records) {
      expect(validBusinessUnits.has(record.businessUnit)).toBe(true);
      expect(validRegions.has(record.region)).toBe(true);
    }
  });

  it("only uses known status values", () => {
    const validStatuses = new Set(["completed", "processing", "pending"]);
    for (const record of records) {
      expect(validStatuses.has(record.status)).toBe(true);
    }
  });

  it("formats revenue as a GBP currency string", () => {
    for (const record of records) {
      expect(record.revenue).toMatch(/^£[\d,]+$/);
    }
  });

  it("keeps transactions within the generated range", () => {
    for (const record of records) {
      expect(record.transactions).toBeGreaterThanOrEqual(100);
      expect(record.transactions).toBeLessThan(1600);
    }
  });

  it("dates fall within the 2026 calendar year", () => {
    for (const record of records) {
      const [day, month, year] = record.date.split("/").map(Number);
      const parsed = new Date(year, month - 1, day);
      expect(parsed.getFullYear()).toBe(2026);
    }
  });
});
