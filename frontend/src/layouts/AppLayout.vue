<template>
  <v-app>
    <!-- App Bar (Header) -->
    <app-header
      :is-mobile="isMobile"
      :nav-items="navItems"
      :drawer-open="drawer"
      @update:drawer-open="drawer = $event"
    />

    <!-- Navigation drawer for mobile view -->
    <mobile-drawer
      :model-value="drawer"
      :nav-items="navItems"
      @update:model-value="drawer = $event"
    />

    <!-- Main content -->
    <v-main>
      <v-container fluid>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDisplay } from 'vuetify'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileDrawer from '@/components/layout/MobileDrawer.vue'

// Responsive display
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// Navigation drawer state
const drawer = ref(false)

// Navigation items - centralized here for consistency
const navItems = [
  { title: 'Home', to: '/', icon: 'mdi-home' },
  { title: 'Products', to: '/products', icon: 'mdi-shopping' },
  { title: 'Categories', to: '/categories', icon: 'mdi-shape' },
  { title: 'Cart', to: '/cart', icon: 'mdi-cart' },
]

// Close drawer when window is resized to desktop
const handleResize = () => {
  if (!mobile.value) {
    drawer.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
