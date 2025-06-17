<template>
  <v-container v-if="isLoading">
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card class="pa-4">
          <v-card-title class="text-h4 mb-4">My Profile</v-card-title>

          <!-- Safe skeleton loader implementation -->
          <div class="skeleton-wrapper">
            <!-- Profile info skeleton -->
            <div class="mb-6">
              <div class="skeleton-line skeleton-title mb-4"></div>
              <div class="skeleton-line mb-2"></div>
              <div class="skeleton-line mb-2"></div>
            </div>

            <!-- Password section skeleton -->
            <div class="mb-6">
              <div class="skeleton-line skeleton-title mb-4"></div>
              <div class="skeleton-line mb-2"></div>
              <div class="skeleton-line mb-2"></div>
            </div>

            <!-- Button skeleton -->
            <div class="d-flex justify-end">
              <div class="skeleton-button"></div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card class="pa-4">
          <v-card-title class="text-h4 mb-4">My Profile</v-card-title>

          <v-alert
            v-if="authStore.error"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
          >
            {{ authStore.error }}
          </v-alert>

          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mb-4"
            closable
          >
            {{ successMessage }}
          </v-alert>

          <template v-if="authStore.user">
            <v-form @submit.prevent="updateProfile" ref="form">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileData.name"
                    label="Full Name"
                    :rules="[rules.required]"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileData.email"
                    label="Email"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    variant="outlined"
                    prepend-inner-icon="mdi-email"
                    disabled
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-4"></v-divider>
                  <v-card-title class="px-0">Change Password</v-card-title>
                  <v-card-subtitle class="px-0 mb-4"
                    >Leave blank if you don't want to change your
                    password</v-card-subtitle
                  >
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileData.password"
                    label="New Password"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                    variant="outlined"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="showPassword = !showPassword"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileData.password_confirmation"
                    label="Confirm New Password"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="confirmPasswordRules"
                    variant="outlined"
                    prepend-inner-icon="mdi-lock-check"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-4"></v-divider>
                </v-col>

                <v-col cols="12" class="d-flex justify-end">
                  <v-btn type="submit" color="primary" :loading="updating">
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>

            <v-divider class="my-6"></v-divider>

            <v-card-title class="px-0">Account Actions</v-card-title>
            <v-card-text class="px-0">
              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-logout"
                @click="logout"
                :loading="authStore.loading"
              >
                Logout
              </v-btn>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const form = ref(null)
const updating = ref(false)
const showPassword = ref(false)
const successMessage = ref('')

// Computed property to handle loading state
const isLoading = computed(() => {
  // Consider loading if:
  // 1. Auth store is explicitly in loading state
  // 2. User data is not available yet
  // 3. We have a token but no user data (still initializing)
  return (
    authStore.loading ||
    !authStore.user ||
    (authStore.isAuthenticated && !authStore.user)
  )
})

// Form data
const profileData = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

// Validation rules
const rules = {
  required: v => !!v || 'This field is required',
  email: v => /.+@.+\..+/.test(v) || 'Please enter a valid email',
}

// Watch for user data changes and update form
watch(
  () => authStore.user,
  newUser => {
    if (newUser) {
      profileData.value.name = newUser.name || ''
      profileData.value.email = newUser.email || ''
    }
  },
  { immediate: true },
)

const passwordRules = computed(() => {
  if (!profileData.value.password) return []
  return [v => !v || v.length >= 8 || 'Password must be at least 8 characters']
})

const confirmPasswordRules = computed(() => {
  if (!profileData.value.password) return []
  return [
    v => !profileData.value.password || !!v || 'Please confirm your password',
    v => v === profileData.value.password || 'Passwords do not match',
  ]
})

// Initialize profile data from auth store
onMounted(() => {
  if (authStore.user) {
    profileData.value.name = authStore.user.name
    profileData.value.email = authStore.user.email
  }
})

// Update profile
const updateProfile = async () => {
  const { valid } = await form.value.validate()

  if (valid) {
    updating.value = true

    try {
      // This would call an API endpoint to update the user profile
      // For now, we'll just update the local user data
      authStore.user.name = profileData.value.name

      // Clear password fields
      profileData.value.password = ''
      profileData.value.password_confirmation = ''

      successMessage.value = 'Profile updated successfully'

      // Hide success message after 3 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } catch (error) {
      authStore.error = error.message || 'Failed to update profile'
    } finally {
      updating.value = false
    }
  }
}

// Logout
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.skeleton-wrapper {
  padding: 1rem 0;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-on-surface), 0.1),
    rgba(var(--v-theme-on-surface), 0.05),
    rgba(var(--v-theme-on-surface), 0.1)
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  height: 28px;
  width: 40%;
}

.skeleton-button {
  height: 36px;
  width: 120px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(var(--v-theme-primary), 0.2),
    rgba(var(--v-theme-primary), 0.1),
    rgba(var(--v-theme-primary), 0.2)
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
