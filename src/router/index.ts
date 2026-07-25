import { createMemoryHistory, createRouter } from "vue-router";

import MainRoutes from "./MainRoutes";
import PublicRoutes from "./PublicRoutes";

export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/error/Error404Page.vue"),
    },
    MainRoutes,
    PublicRoutes,
  ],
});
