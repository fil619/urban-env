import { HttpResponse, http } from "msw";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "@/test/setup";
import { useNotificationsStore } from "@/stores/notifications";

describe("useNotificationsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("fetches notifications on creation", async () => {
    const store = useNotificationsStore();
    await store.fetchNotifications();

    expect(store.loaded).toBe(true);
    expect(store.error).toBeNull();
    expect(store.notifications.length).toBeGreaterThan(0);
    expect(store.notifications[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
    });
  });

  it("does not refetch once loaded", async () => {
    const store = useNotificationsStore();
    await store.fetchNotifications();
    const first = store.notifications;

    await store.fetchNotifications();

    expect(store.notifications).toBe(first);
  });

  it("markAllRead deactivates notifications", async () => {
    const store = useNotificationsStore();
    await store.fetchNotifications();

    expect(store.isActive).toBe(true);
    store.markAllRead();
    expect(store.isActive).toBe(false);
  });

  it("records an error message when the request fails", async () => {
    server.use(
      http.get("/api/notifications", () => new HttpResponse(null, { status: 500 })),
    );

    const store = useNotificationsStore();
    await store.fetchNotifications();

    expect(store.loaded).toBe(false);
    expect(store.error).toContain("failed");
  });
});
