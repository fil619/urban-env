import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/components/HomeView.vue";

const routes = [{ path: "/", component: HomeView }];

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
