<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom end"
    min-width="200"
  >
    <template v-slot:activator="{ props }">
      <v-btn variant="text" v-bind="props" class="ml-2" :elevation="0">
        <v-avatar size="32" class="" color="primary">
          <v-img
            v-if="user.avatar"
            :src="user.avatar"
            alt="User avatar"
          ></v-img>
          <span v-else class="text-h6 text-white">{{ userInitials }}</span>
        </v-avatar>
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar size="40" color="primary">
              <v-img
                v-if="user.avatar"
                :src="user.avatar"
                alt="User avatar"
              ></v-img>
              <span v-else class="text-h6 text-white">{{ userInitials }}</span>
            </v-avatar>
          </template>
          <v-list-item-title>{{
            user.name ? user.name : 'User'
          }}</v-list-item-title>
          <v-list-item-subtitle>{{
            user.email ? user.email : ''
          }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          prepend-icon="mdi-account"
          title="My Profile"
          to="/profile"
          @click="menu = false"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-history"
          title="Order History"
          to="/orders"
          @click="menu = false"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          title="Settings"
          to="/settings"
          @click="menu = false"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="logout"
        ></v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => {},
  },
})

const menu = ref(false)
const authStore = useAuthStore()
const router = useRouter()

// Get user initials for avatar fallback
const userInitials = computed(() => {
  if (!props.user || !props.user.name) return '?'
  return props.user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const logout = async () => {
  await authStore.logout()
  menu.value = false
  router.push('/login')
}
</script>
