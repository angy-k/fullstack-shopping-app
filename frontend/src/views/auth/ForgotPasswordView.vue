<template>
  <forgot-password-skeleton v-if="isLoading" />
  <v-container v-else class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <!-- App logo -->
          <div class="d-flex justify-center mb-2">
            <app-logo size="medium" />
          </div>

          <v-card-title class="text-center text-h5 mb-4"
            >Reset Password</v-card-title
          >

          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mb-4"
          >
            {{ successMessage }}
          </v-alert>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>

          <v-form
            @submit.prevent="handleSubmit"
            ref="form"
            v-if="!successMessage"
          >
            <p class="text-body-1 mb-4">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <FormInput
              v-model="email"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              prepend-icon="mdi-email"
              autocomplete="email"
            />

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
              class="mt-4"
            >
              Send Reset Link
            </v-btn>

            <div class="text-center mt-4">
              <router-link
                to="/login"
                class="text-decoration-none"
                :ripple="false"
                style="color: #1976d2"
              >
                Back to Login
              </router-link>
            </div>
          </v-form>

          <div v-else class="text-center">
            <v-btn color="primary" variant="text" to="/login" class="mt-4">
              Back to Login
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  required as requiredRule,
  email as emailRule,
} from '@/utils/validation'
import { useAuthStore } from '@/stores/auth'
import ForgotPasswordSkeleton from '@/components/skeletons/auth/ForgotPasswordSkeleton.vue'
import AppLogo from '@/components/ui/AppLogo.vue'

const authStore = useAuthStore()
const form = ref(null)
const email = ref('')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const isLoading = ref(true)

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

const handleSubmit = async () => {
  const { valid } = await form.value.validate()

  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    // Call the password reset API
    await authStore.forgotPassword(email.value)
    successMessage.value = 'Password reset link has been sent to your email.'
  } catch (err) {
    error.value =
      err.message || 'Failed to send password reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
