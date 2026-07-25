const PublicRoutes = {
  path: "/auth",
  component: () => import("@/layout/blank/BlankLayout.vue"),
  meta: {
    requiresAuth: false,
  },
  children: [
    {
      name: "Error 404",
      path: "/error",
      component: () => import("@/views/error/Error404Page.vue"),
    },
    {
      name: "Not Found",
      path: "/:pathMatch(.*)*",
      component: () => import("@/views/error/Error404Page.vue"),
    },
  ],
};

export default PublicRoutes;
