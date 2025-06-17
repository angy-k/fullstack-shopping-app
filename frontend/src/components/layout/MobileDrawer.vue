<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    temporary
    location="left"
    width="280"
  >
    <v-list>
      <!-- User info -->
      <v-list-item
        :title="isAuthenticated ? user.name : 'Guest'"
        :subtitle="isAuthenticated ? user.email : 'Not logged in'"
      >
        <template v-slot:prepend>
          <v-icon color="indigo-lighten-2" icon="mdi-account-circle"></v-icon>
        </template>
        <template v-slot:append>
          <v-btn
            v-if="isAuthenticated"
            variant="text"
            icon="mdi-cog"
            to="/profile"
            @click="closeDrawer"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Navigation items -->
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        :title="item.title"
        @click="closeDrawer"
      >
        <template v-slot:prepend>
          <v-icon color="indigo-lighten-2">{{ item.icon }}</v-icon>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Login/Logout -->
      <v-list-item v-if="isAuthenticated" title="Logout" @click="logout">
        <template v-slot:prepend>
          <v-icon color="indigo-lighten-2">mdi-logout</v-icon>
        </template>
      </v-list-item>
      <v-list-item v-else title="Login" to="/login" @click="closeDrawer">
        <template v-slot:prepend>
          <v-icon color="indigo-lighten-2">mdi-login</v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  navItems: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

// Auth state
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user || {})

// Close drawer
const closeDrawer = () => {
  emit('update:modelValue', false)
}

// Logout function
const router = useRouter()
const logout = async () => {
  await authStore.logout()
  closeDrawer()
  router.push('/home')
}
</script>
