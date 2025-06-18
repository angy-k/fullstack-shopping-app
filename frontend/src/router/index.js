import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Route configuration with layout and auth requirements
 *
 * Each route can specify:
 * - meta.layout: 'AppLayout' (default) or 'EmptyLayout'
 * - meta.requiresAuth: true if authentication is required
 * - meta.guestOnly: true if route should only be accessible to non-authenticated users */
const routes = [
  // Public routes with app layout
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      layout: 'AppLayout',
    },
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductsView.vue'),
    meta: {
      layout: 'AppLayout',
    },
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: {
      layout: 'AppLayout',
    },
    props: true,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/CategoriesView.vue'),
    meta: {
      layout: 'AppLayout',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      layout: 'AppLayout',
      requiresAuth: true,
    },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/CartView.vue'),
    meta: {
      layout: 'AppLayout',
    },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: {
      layout: 'AppLayout',
      requiresAuth: true,
    },
  },

  // Guest-only routes with empty layout
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      layout: 'AuthLayout',
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: {
      layout: 'AuthLayout',
      guestOnly: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: {
      layout: 'AuthLayout',
      guestOnly: true,
    },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    meta: {
      layout: 'AuthLayout',
      guestOnly: true,
    },
  },

  // Error pages
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      layout: 'ErrorLayout',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top on navigation
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize user data if we have a token but no user data yet
  if (authStore.isAuthenticated && !authStore.user && !authStore.loading) {
    try {
      // Wait for user data to load
      await authStore.init()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load user data:', error)
      // If loading user data fails, redirect to login
      if (to.meta.requiresAuth) {
        return next({ name: 'Login', query: { redirect: to.fullPath } })
      }
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if not authenticated
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Check if route is for guests only
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    // Redirect to home if already authenticated
    return next({ name: 'Home' })
  }

  // Proceed as normal
  next()
})

export default router
