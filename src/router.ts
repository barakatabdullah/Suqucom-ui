import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
// import { useUserStore } from './stores/user'

export const router = createRouter({
  history: createWebHistory(),
  extendRoutes: (routes: any) => setupLayouts(routes)
})

// router.beforeEach((to, from, next) => {
//   const userStore = useUserStore()
//   if (to.meta.requiresAuth && !userStore.user.token) next({ name: 'Login' })
//   else next()
// })