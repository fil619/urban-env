import { ref } from "vue";

import { defineStore } from "pinia";

interface KpiCard {
  name: string;
  earn: string;
  percent: string;
  color: string;
  icon: string;
  text: string;
}

interface RecordItem {
  date: string;
  businessUnit: string;
  region: string;
  revenue: string;
  transactions: number;
  status: string;
}

interface RecentRecordsFilters {
  fromDate?: Date | null;
  toDate?: Date | null;
  region?: string | null;
  status?: string | null;
}

export const useDashboardStore = defineStore("dashboard", () => {
  const kpis = ref<KpiCard[]>([]);
  const revenueTrend = ref<number[]>([]);
  const revenueByRegion = ref<number[]>([]);
  const revenueByRegionLabels = ref<string[]>([]);
  const recentRecords = ref<RecordItem[]>([]);
  const loaded = ref(false);
  const error = ref<string | null>(null);
  let fetchPromise: Promise<void> | null = null;

  function fetchDashboardData() {
    if (loaded.value) return Promise.resolve();
    if (fetchPromise) return fetchPromise;

    error.value = null;

    fetchPromise = (async () => {
      try {
        const [kpisRes, revenueTrendRes, revenueByRegionRes, recentRes] =
          await Promise.all([
            fetch("/api/dashboard/kpis"),
            fetch("/api/dashboard/revenue-trend"),
            fetch("/api/dashboard/revenue-by-region"),
            fetch("/api/records/recent"),
          ]);

        for (const res of [
          kpisRes,
          revenueTrendRes,
          revenueByRegionRes,
          recentRes,
        ]) {
          if (!res.ok) {
            throw new Error(`Request to ${res.url} failed (${res.status})`);
          }
        }

        const revenueByRegionJson = await revenueByRegionRes.json();

        kpis.value = await kpisRes.json();
        revenueTrend.value = (await revenueTrendRes.json()).data;
        revenueByRegion.value = revenueByRegionJson.data;
        revenueByRegionLabels.value = revenueByRegionJson.labels;
        recentRecords.value = await recentRes.json();

        loaded.value = true;
      } catch (err) {
        error.value =
          err instanceof Error ? err.message : "Failed to load dashboard data";
      } finally {
        fetchPromise = null;
      }
    })();

    return fetchPromise;
  }

  async function fetchFilteredData(filters: RecentRecordsFilters = {}) {
    const params = new URLSearchParams();
    if (filters.fromDate) {
      params.set("fromDate", filters.fromDate.toISOString());
    }
    if (filters.toDate) {
      params.set("toDate", filters.toDate.toISOString());
    }
    if (filters.region) {
      params.set("region", filters.region);
    }
    if (filters.status) {
      params.set("status", filters.status);
    }

    error.value = null;

    try {
      const [recentRes, revenueByRegionRes] = await Promise.all([
        fetch(`/api/records/recent?${params.toString()}`),
        fetch(`/api/dashboard/revenue-by-region?${params.toString()}`),
      ]);

      for (const res of [recentRes, revenueByRegionRes]) {
        if (!res.ok) {
          throw new Error(`Request to ${res.url} failed (${res.status})`);
        }
      }

      const revenueByRegionJson = await revenueByRegionRes.json();

      recentRecords.value = await recentRes.json();
      revenueByRegion.value = revenueByRegionJson.data;
      revenueByRegionLabels.value = revenueByRegionJson.labels;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load records";
    }
  }

  fetchDashboardData();

  return {
    kpis,
    revenueTrend,
    revenueByRegion,
    revenueByRegionLabels,
    recentRecords,
    loaded,
    error,
    fetchDashboardData,
    fetchFilteredData,
  };
});
