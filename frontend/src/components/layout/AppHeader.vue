<template>
  <v-app-bar :elevation="1" class="border-b">
    <!-- Menu button for mobile view -->
    <v-app-bar-nav-icon
      v-if="isMobile"
      @click="toggleDrawer"
      aria-label="Toggle navigation menu"
      :elevation="0"
    ></v-app-bar-nav-icon>
    
    <!-- App logo -->
    <v-app-bar-title>
      <app-logo size="small" />
    </v-app-bar-title>
    
    <!-- Navigation items for desktop view -->
    <template v-if="!isMobile">
      <v-spacer></v-spacer>
      <nav-menu :items="navItems" />
    </template>
    
    <v-spacer></v-spacer>
    
    <!-- Theme toggle -->
    <theme-toggle />
    
    <!-- User menu for desktop view -->
    <template v-if="!isMobile">
      <user-menu v-if="isAuthenticated" :user="user" />
      <v-btn 
        v-else 
        variant="text" 
        to="/login"
        :ripple="false"
        :elevation="0"
        class="nav-btn indigo-lighten-2--text"
      >
        Login
        <v-icon end color="indigo-lighten-2">mdi-login</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import NavMenu from '@/components/NavMenu.vue';
import UserMenu from '@/components/UserMenu.vue';
import { useAuthStore } from '@/stores/auth';
import AppLogo from '@/components/ui/AppLogo.vue';

const props = defineProps({
  isMobile: {
    type: Boolean,
    required: true
  },
  navItems: {
    type: Array,
    required: true
  },
  drawerOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:drawerOpen']);

// Auth state
const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user || {});

// Toggle drawer
const toggleDrawer = () => {
  emit('update:drawerOpen', !props.drawerOpen);
};
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
}

.nav-btn {
  box-shadow: none !important;
  border: none !important;
  position: relative;
  font-weight: 500;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: rgb(var(--v-theme-indigo-lighten-2));
  transition: width 0.3s ease;
}

.nav-btn:hover::after,
.nav-btn.router-link-active::after {
  width: 70%;
}
</style>
