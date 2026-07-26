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

export const useDashboardStore = defineStore("dashboard", () => {
  const kpis = ref<KpiCard[]>([]);
  const revenueTrend = ref<number[]>([]);
  const revenueByRegion = ref<number[]>([]);
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

        kpis.value = await kpisRes.json();
        revenueTrend.value = (await revenueTrendRes.json()).data;
        revenueByRegion.value = (await revenueByRegionRes.json()).data;
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

  fetchDashboardData();

  return {
    kpis,
    revenueTrend,
    revenueByRegion,
    recentRecords,
    loaded,
    error,
    fetchDashboardData,
  };
});
