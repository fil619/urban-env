<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
  avatar: string;
}

const isActive = ref(true);
const notifications = shallowRef<NotificationItem[]>([]);

onMounted(async () => {
  const response = await fetch("/api/notifications");
  notifications.value = await response.json();
});

function deactivateItem() {
  isActive.value = false;
}
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
          :content="isActive ? notifications.length : 0"
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
            :class="isActive ? 'd-block' : 'd-none'"
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
              :content-class="isActive ? 'custom-tooltip' : 'd-none'"
            >
              <span class="text-caption">Mark as all read</span>
            </v-tooltip>
          </v-btn>
        </div>
      </div>
      <v-divider></v-divider>
      <div style="height: calc(100vh - 300px); max-height: 265px">
        <v-list
          class="py-0"
          lines="two"
          aria-label="notification list"
          aria-busy="true"
        >
          <template
            v-for="(notification, i) in notifications"
            :key="notification.id"
          >
            <v-list-item
              :value="notification.id"
              color="secondary"
              class="no-spacer py-1"
              :active="isActive"
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
              <div class="d-inline-flex justify-space-between w-100">
                <h6 class="text-subtitle-1 font-weight-regular mb-0">
                  {{ notification.title }}
                </h6>
                <span class="text-caption">{{ notification.time }}</span>
              </div>

              <p class="text-caption text-medium-emphasis my-0">
                {{ notification.message }}
              </p>
            </v-list-item>
            <v-divider v-if="i < notifications.length - 1"></v-divider>
          </template>
        </v-list>
      </div>
      <v-divider></v-divider>
      <div class="pa-2 text-center">
        <v-btn color="primary" variant="text">View All</v-btn>
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
