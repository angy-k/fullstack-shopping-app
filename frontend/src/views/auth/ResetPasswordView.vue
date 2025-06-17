<template>
  <reset-password-skeleton v-if="isLoading" />
  <v-container v-else class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <!-- App logo -->
          <div class="d-flex justify-center mb-2">
            <app-logo size="medium" />
          </div>
          
          <v-card-title class="text-center text-h5 mb-4">Reset Password</v-card-title>
          
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
          
          <v-form @submit.prevent="handleSubmit" ref="form" v-if="!successMessage">
            <FormInput
              v-model="password"
              label="New Password"
              type="password"
              :rules="[rules.required, rules.password]"
              variant="outlined"
              prepend-icon="mdi-lock"
              toggle-password
              autocomplete="new-password"
              hint="At least 8 characters with letters and numbers"
              persistent-hint
            />
            
            <FormInput
              v-model="passwordConfirmation"
              label="Confirm Password"
              type="password"
              :rules="[rules.required, rules.passwordMatch]"
              variant="outlined"
              prepend-icon="mdi-lock-check"
              autocomplete="new-password"
            />
            
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
              class="mt-4"
            >
              Reset Password
            </v-btn>
          </v-form>
          
          <div v-else class="text-center">
            <v-btn
              color="primary"
              variant="text"
              to="/login"
              class="mt-4"
            >
              Back to Login
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { required as requiredRule, minLength as minLengthRule, passwordMatch as passwordMatchRule } from '@/utils/validation';
import { useAuthStore } from '@/stores/auth';
import ResetPasswordSkeleton from '@/components/skeletons/auth/ResetPasswordSkeleton.vue';
import AppLogo from '@/components/ui/AppLogo.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const form = ref(null);
const isLoading = ref(true);

// Form data
const password = ref('');
const passwordConfirmation = ref('');
const token = ref('');
const email = ref('');
const error = ref('');
const successMessage = ref('');
const loading = ref(false);

// Validation rules
const rules = {
  required: requiredRule(),
  password: minLengthRule(8, 'Password must be at least 8 characters'),
  passwordMatch: passwordMatchRule(() => password.value, 'Passwords do not match')
};

onMounted(() => {
  // Get token and email from query parameters
  token.value = route.query.token || '';
  email.value = route.query.email || '';
  
  if (!token.value || !email.value) {
    error.value = 'Invalid password reset link. Please request a new one.';
  }
  
  // Simulate loading time or wait for any necessary data
  setTimeout(() => {
    isLoading.value = false;
  }, 800); // Show skeleton for 800ms
});

const handleSubmit = async () => {
  const { valid } = await form.value.validate();
  
  if (!valid) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    // Call the reset password API
    await authStore.resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    });
    
    successMessage.value = 'Your password has been reset successfully. You can now log in with your new password.';
  } catch (err) {
    error.value = err.message || 'Failed to reset password. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
