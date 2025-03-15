import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";

import { routes } from "vue-router/auto-routes";

export const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const adminStore = useAdminStore();
  if (to.meta.requiresAdmin && !adminStore.admin.token) {
    return next({ name: "AdminLogin" });
  } else if (to.name === "AdminLogin" && adminStore.admin.token) {
    return next({ name: "AdminDashboard" });
  } else if (to.meta.requiresAuth && !userStore.user.token) {
    return next({ name: "Login" });
  }

  next();
});
