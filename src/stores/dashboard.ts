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
  region?: string[] | null;
  status?: string[] | null;
}

export const useDashboardStore = defineStore("dashboard", () => {
  const kpis = ref<KpiCard[]>([]);
  const revenueTrend = ref<number[]>([]);
  const revenueTrendLabels = ref<string[]>([]);
  const revenueByRegion = ref<number[]>([]);
  const revenueByRegionLabels = ref<string[]>([]);
  const revenueByBusinessUnit = ref<number[]>([]);
  const revenueByBusinessUnitLabels = ref<string[]>([]);
  const orderStatus = ref<number[]>([]);
  const orderStatusLabels = ref<string[]>([]);
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
        const [
          kpisRes,
          revenueTrendRes,
          revenueByRegionRes,
          revenueByBusinessUnitRes,
          orderStatusRes,
          recentRes,
        ] = await Promise.all([
          fetch("/api/dashboard/kpis"),
          fetch("/api/dashboard/revenue-trend"),
          fetch("/api/dashboard/revenue-by-region"),
          fetch("/api/dashboard/revenue-by-business-unit"),
          fetch("/api/dashboard/order-status"),
          fetch("/api/records/recent"),
        ]);

        for (const res of [
          kpisRes,
          revenueTrendRes,
          revenueByRegionRes,
          revenueByBusinessUnitRes,
          orderStatusRes,
          recentRes,
        ]) {
          if (!res.ok) {
            throw new Error(`Request to ${res.url} failed (${res.status})`);
          }
        }

        const revenueTrendJson = await revenueTrendRes.json();
        const revenueByRegionJson = await revenueByRegionRes.json();
        const revenueByBusinessUnitJson = await revenueByBusinessUnitRes.json();
        const orderStatusJson = await orderStatusRes.json();

        kpis.value = await kpisRes.json();
        revenueTrend.value = revenueTrendJson.data;
        revenueTrendLabels.value = revenueTrendJson.labels;
        revenueByRegion.value = revenueByRegionJson.data;
        revenueByRegionLabels.value = revenueByRegionJson.labels;
        revenueByBusinessUnit.value = revenueByBusinessUnitJson.data;
        revenueByBusinessUnitLabels.value = revenueByBusinessUnitJson.labels;
        orderStatus.value = orderStatusJson.data;
        orderStatusLabels.value = orderStatusJson.labels;
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
      for (const region of filters.region) {
        params.append("region", region);
      }
    }
    if (filters.status) {
      for (const status of filters.status) {
        params.append("status", status);
      }
    }

    error.value = null;

    try {
      const [
        recentRes,
        revenueByRegionRes,
        revenueByBusinessUnitRes,
        orderStatusRes,
        revenueTrendRes,
        kpisRes,
      ] = await Promise.all([
        fetch(`/api/records/recent?${params.toString()}`),
        fetch(`/api/dashboard/revenue-by-region?${params.toString()}`),
        fetch(`/api/dashboard/revenue-by-business-unit?${params.toString()}`),
        fetch(`/api/dashboard/order-status?${params.toString()}`),
        fetch(`/api/dashboard/revenue-trend?${params.toString()}`),
        fetch(`/api/dashboard/kpis?${params.toString()}`),
      ]);

      for (const res of [
        recentRes,
        revenueByRegionRes,
        revenueByBusinessUnitRes,
        orderStatusRes,
        revenueTrendRes,
        kpisRes,
      ]) {
        if (!res.ok) {
          throw new Error(`Request to ${res.url} failed (${res.status})`);
        }
      }

      const revenueByRegionJson = await revenueByRegionRes.json();
      const revenueByBusinessUnitJson = await revenueByBusinessUnitRes.json();
      const orderStatusJson = await orderStatusRes.json();
      const revenueTrendJson = await revenueTrendRes.json();

      recentRecords.value = await recentRes.json();
      revenueByRegion.value = revenueByRegionJson.data;
      revenueByRegionLabels.value = revenueByRegionJson.labels;
      revenueByBusinessUnit.value = revenueByBusinessUnitJson.data;
      revenueByBusinessUnitLabels.value = revenueByBusinessUnitJson.labels;
      orderStatus.value = orderStatusJson.data;
      orderStatusLabels.value = orderStatusJson.labels;
      revenueTrend.value = revenueTrendJson.data;
      revenueTrendLabels.value = revenueTrendJson.labels;
      kpis.value = await kpisRes.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load records";
    }
  }

  fetchDashboardData();

  return {
    kpis,
    revenueTrend,
    revenueTrendLabels,
    revenueByRegion,
    revenueByRegionLabels,
    revenueByBusinessUnit,
    revenueByBusinessUnitLabels,
    orderStatus,
    orderStatusLabels,
    recentRecords,
    loaded,
    error,
    fetchDashboardData,
    fetchFilteredData,
  };
});
