import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserPermission, UseRole } from '@/types/auth'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiredRoles?: UserRole[]
    requiredPermissions?: UserPermission[]
    redirectGuestTo?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // Admin routes protected by our RBAC
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: {
        requiredAuth: true,
        requiredRoles: ['admin'],           // Only administrators can enter here
        requiredPermissions: ['orders:read-all']
      }
    },
    {
      path: '/unhautorized',
      name: 'unhautorized',
      component: UnauthorizedView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

/**
 * GLOBAL BEFORE GUARD: Executed before each route change
 */

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. Check if route needs authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If not logged in, redirect to the login or fallback route specified
    const redirectTo = to.meta.redirectGuestTo || '/login'
    return next({ path: redirectTo, query: { redirect: to.fullPath } })
  }

  // 2. Check if the route requires specific roles
  if(to.meta.requiredRoles) {
    const hasRequiredRole = to.meta.requiredRoles.includes(authStore.currentRole)
    if (!hasRequiredRole) {
      // User is logged in but does not have the correct role -> 403 / Unauthorized error screen
      return next({ name: 'unauthorized' })

    }
  }

  // 3. Check if the route requires specific permissions (additional fine-grained level)
  if (to.meta.requiredPermissions) {
    const hasAllPermissions = to.meta.requiredPermissions.every(perm => authStore.hasPermission(perm))
    if(!hasAllPermissions) {
      return next({ name: 'unauthorized' })
    }
  }

  // If it passes all the checks, give the green light to navigation
  next()
})

export default router
