<template>
  <!-- The component matched by the route will render here -->
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Import layouts
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import ErrorLayout from '@/layouts/ErrorLayout.vue'

const route = useRoute()

// Determine which layout to use based on route meta
const layout = computed(() => {
  // Default to AppLayout if no layout is specified in route meta
  const layoutName = route.meta.layout || 'AppLayout'

  // Map layout name to component
  const layouts = {
    AppLayout,
    AuthLayout,
    ErrorLayout,
  }

  return layouts[layoutName]
})
</script>
