import { ref } from "vue";

import { defineStore } from "pinia";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  avatar: string;
}

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref<NotificationItem[]>([]);
  const isActive = ref(true);
  const loaded = ref(false);
  const error = ref<string | null>(null);
  let fetchPromise: Promise<void> | null = null;

  const fetchNotifications = (): Promise<void> => {
    if (loaded.value) return Promise.resolve();
    if (fetchPromise) return fetchPromise;

    error.value = null;

    fetchPromise = (async (): Promise<void> => {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) {
          throw new Error(
            `Request to ${response.url} failed (${response.status})`,
          );
        }
        notifications.value = await response.json();
        loaded.value = true;
      } catch (err) {
        error.value =
          err instanceof Error ? err.message : "Failed to load notifications";
      } finally {
        fetchPromise = null;
      }
    })();

    return fetchPromise;
  };

  const markAllRead = (): void => {
    isActive.value = false;
  };

  return {
    notifications,
    isActive,
    loaded,
    error,
    fetchNotifications,
    markAllRead,
  };
});
