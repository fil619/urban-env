import { createRouter, createWebHistory } from "vue-router";

import MainRoutes from "./MainRoutes";
import PublicRoutes from "./PublicRoutes";

export const router = createRouter({
<<<<<<< Updated upstream
  history: createMemoryHistory(),
  routes,
=======
  history: createWebHistory(),
  routes: [
    {
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/error/Error404Page.vue"),
    },
    MainRoutes,
    PublicRoutes,
  ],
>>>>>>> Stashed changes
});
