<script setup lang="ts">
import { onMounted } from "vue";
import { useNotificationsStore } from "@/stores/notifications";

const notificationsStore = useNotificationsStore();

const deactivateItem = (): void => {
  notificationsStore.markAllRead();
};

onMounted(() => {
  void notificationsStore.fetchNotifications();
});
</script>

<template>
  <v-menu :close-on-content-click="false" offset="6, 0">
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        class="text-secondary ml-sm-2 ml-1 mr-3"
        color="darkText"
        rounded="sm"
        size="small"
        v-bind="props"
      >
        <v-badge
          :content="
            notificationsStore.isActive
              ? notificationsStore.notifications.length
              : 0
          "
          color="primary"
          offset-x="-4"
          offset-y="-5"
        >
          <v-icon
            color="blue-darken-2"
            icon="mdi-bell-outline"
            size="large"
          ></v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="387" class="notification-dropdown">
      <div class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <h6 class="text-subtitle-1 mb-0">Notifications</h6>
          <v-btn
            variant="text"
            color="success"
            icon
            rounded
            size="small"
            @click="deactivateItem()"
            :class="notificationsStore.isActive ? 'd-block' : 'd-none'"
          >
            <v-icon
              color="blue-darken-2"
              icon="mdi-check-circle-outline"
              size="large"
            ></v-icon>
            <v-tooltip
              aria-label="tooltip"
              activator="parent"
              location="bottom"
              :content-class="
                notificationsStore.isActive ? 'custom-tooltip' : 'd-none'
              "
            >
              <span class="text-caption">Mark as all read</span>
            </v-tooltip>
          </v-btn>
        </div>
      </div>
      <v-divider></v-divider>
      <v-alert
        v-if="notificationsStore.error"
        type="error"
        variant="tonal"
        density="compact"
        class="ma-4"
      >
        <div class="d-flex align-center justify-space-between">
          <span class="text-caption">{{ notificationsStore.error }}</span>
          <v-btn
            size="x-small"
            variant="text"
            @click="notificationsStore.fetchNotifications()"
          >
            Retry
          </v-btn>
        </div>
      </v-alert>
      <div
        style="max-height: min(calc(100vh - 300px), 265px); overflow-y: auto"
      >
        <v-list
          class="py-0"
          lines="two"
          aria-label="notification list"
          aria-busy="true"
        >
          <template
            v-for="(notification, i) in notificationsStore.notifications"
            :key="notification.id"
          >
            <v-list-item
              :value="notification.id"
              color="secondary"
              class="no-spacer py-1"
              :active="notificationsStore.isActive"
            >
              <template v-slot:prepend>
                <v-avatar
                  size="36"
                  variant="flat"
                  :color="notification.avatar"
                  :class="`mr-3 py-2 text-${notification.color}`"
                >
                  <v-icon
                    color="blue-darken-2"
                    :icon="notification.icon"
                    size="large"
                  ></v-icon>
                </v-avatar>
              </template>
              <div class="d-flex align-center w-100">
                <h6 class="text-subtitle-1 font-weight-regular mb-0">
                  {{ notification.title }}
                </h6>
                <span class="text-caption ms-auto pl-2">{{
                  notification.time
                }}</span>
              </div>

              <p class="text-caption text-medium-emphasis my-0">
                {{ notification.message }}
              </p>
            </v-list-item>
            <v-divider
              v-if="i < notificationsStore.notifications.length - 1"
            ></v-divider>
          </template>
        </v-list>
      </div>
      <v-divider></v-divider>
      <div class="pa-2 text-center">
        <v-btn disabled color="primary" variant="text" to="/notifications"
          >View All</v-btn
        >
      </div>
    </v-sheet>
  </v-menu>
</template>

<style lang="scss">
.v-tooltip {
  > .v-overlay__content.custom-tooltip {
    padding: 2px 6px;
  }
}
</style>
