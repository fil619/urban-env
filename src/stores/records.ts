import { ref } from "vue";

import { defineStore } from "pinia";

interface RecordItem {
  id: number;
  date: string;
  businessUnit: string;
  region: string;
  revenue: string;
  transactions: number;
  status: string;
}

interface RecordsQuery {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order?: boolean | "asc" | "desc" }[];
  search: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  region?: string[] | null;
  status?: string[] | null;
}

export const useRecordsStore = defineStore("records", () => {
  const items = ref<RecordItem[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  let lastQueryKey: string | null = null;
  let pendingQueryKey: string | null = null;
  let pendingPromise: Promise<void> | null = null;

  const fetchRecords = (query: RecordsQuery): Promise<void> => {
    const queryKey = JSON.stringify(query);
    if (queryKey === lastQueryKey) return Promise.resolve();
    if (queryKey === pendingQueryKey && pendingPromise) return pendingPromise;

    loading.value = true;
    error.value = null;
    pendingQueryKey = queryKey;

    pendingPromise = (async (): Promise<void> => {
      try {
        const params = new URLSearchParams({
          page: String(query.page),
          itemsPerPage: String(query.itemsPerPage),
        });

        if (query.search) {
          params.set("search", query.search);
        }

        if (query.fromDate) {
          params.set("fromDate", query.fromDate.toISOString());
        }

        if (query.toDate) {
          params.set("toDate", query.toDate.toISOString());
        }

        if (query.region) {
          for (const region of query.region) {
            params.append("region", region);
          }
        }

        if (query.status) {
          for (const status of query.status) {
            params.append("status", status);
          }
        }

        const sort = query.sortBy[0];
        if (sort != null) {
          params.set("sortBy", sort.key);
          params.set("sortOrder", sort.order === "desc" ? "desc" : "asc");
        }

        const response = await fetch(`/api/records?${params.toString()}`);
        if (!response.ok) {
          throw new Error(
            `Request to ${response.url} failed (${response.status})`,
          );
        }

        const data = await response.json();

        items.value = data.items;
        total.value = data.total;
        lastQueryKey = queryKey;
      } catch (err) {
        error.value =
          err instanceof Error ? err.message : "Failed to load records";
      } finally {
        loading.value = false;
        pendingQueryKey = null;
        pendingPromise = null;
      }
    })();

    return pendingPromise;
  };

  return {
    items,
    total,
    loading,
    error,
    fetchRecords,
  };
});
