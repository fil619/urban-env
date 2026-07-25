const MainRoutes = {
  path: "/main",
  meta: {
    requiresAuth: true,
  },
  redirect: "/main",
  component: () => import("@/layout/dashboard/DashboardLayout.vue"),
  children: [
    {
      name: "LandingPage",
      path: "/",
      component: () => import("@/views/dashboard/DashboardPage.vue"),
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      component: () => import("@/views/dashboard/DashboardPage.vue"),
    },
    {
      name: "Records",
      path: "/records",
      component: () => import("@/views/records/RecordsPage.vue"),
    },
  ],
};

export default MainRoutes;
