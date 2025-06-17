<template>
  <login-skeleton v-if="isLoading" />
  <v-container v-else class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <!-- App logo -->
          <div class="d-flex justify-center mb-2">
            <app-logo size="medium" />
          </div>

          <v-card-title class="text-center text-h5 mb-4">Login</v-card-title>

          <v-form @submit.prevent="handleLogin" ref="form">
            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
            >
              {{ authStore.error }}
            </v-alert>

            <FormInput
              v-model="email"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              prepend-icon="mdi-email"
              autocomplete="email"
            />

            <FormInput
              v-model="password"
              label="Password"
              type="password"
              :rules="[rules.required]"
              variant="outlined"
              prepend-icon="mdi-lock"
              toggle-password
              autocomplete="current-password"
            />

            <div class="d-flex justify-space-between align-center mb-4">
              <v-checkbox
                v-model="rememberMe"
                label="Remember me"
                hide-details
                density="compact"
              ></v-checkbox>

              <router-link
                to="/forgot-password"
                class="text-decoration-none text-caption"
                :ripple="false"
                style="color: #1976d2"
              >
                Forgot password?
              </router-link>
            </div>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="authStore.loading"
            >
              Login
            </v-btn>

            <div class="text-center mt-4">
              <span class="text-body-2">Don't have an account?</span>
              <router-link
                to="/register"
                class="text-decoration-none ml-2"
                :ripple="false"
                style="color: #1976d2"
              >
                Register
              </router-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  required as requiredRule,
  email as emailRule,
} from '@/utils/validation'
import LoginSkeleton from '@/components/skeletons/auth/LoginSkeleton.vue'
import AppLogo from '@/components/ui/AppLogo.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const form = ref(null)
const isLoading = ref(true)

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

// Initialize component with loading state
onMounted(() => {
  // Simulate loading time or wait for any necessary data
  setTimeout(() => {
    isLoading.value = false
  }, 800) // Show skeleton for 800ms
})

// Validation rules
const rules = {
  required: requiredRule(),
  email: emailRule(),
}

// Handle login submission
const handleLogin = async () => {
  const { valid } = await form.value.validate()

  if (valid) {
    const success = await authStore.login({
      email: email.value,
      password: password.value,
      device_name: navigator.userAgent,
    })

    if (success) {
      // Redirect to the originally requested page or home
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    }
  }
}
</script>
