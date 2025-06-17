<template>
  <register-skeleton v-if="isLoading" />
  <v-container v-else class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <!-- App logo -->
          <div class="d-flex justify-center mb-2">
            <app-logo size="medium" />
          </div>
          
          <v-card-title class="text-center text-h5 mb-4">Register</v-card-title>
          
          <v-form @submit.prevent="handleRegister" ref="form">
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
              v-model="name"
              label="Full Name"
              :rules="[rules.required]"
              variant="outlined"
              prepend-icon="mdi-account"
              autocomplete="name"
            />
            
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
            
            <v-checkbox
              v-model="termsAccepted"
              :rules="[rules.termsRequired]"
              label="I agree to the Terms and Privacy Policy"
              class="mb-4"
            ></v-checkbox>
            
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="authStore.loading"
            >
              Register
            </v-btn>
            
            <div class="text-center mt-4">
              <span class="text-body-2">Already have an account?</span>
              <router-link 
                to="/login" 
                class="text-decoration-none ml-2"
                :ripple="false"
                style="color: #1976D2;"
              >
                Login
              </router-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { required as requiredRule, email as emailRule, minLength as minLengthRule, passwordMatch as passwordMatchRule } from '@/utils/validation';
import RegisterSkeleton from '@/components/skeletons/auth/RegisterSkeleton.vue';
import AppLogo from '@/components/ui/AppLogo.vue';

const router = useRouter();
const authStore = useAuthStore();
const form = ref(null);
const isLoading = ref(true);

// Initialize component with loading state
onMounted(() => {
  // Simulate loading time or wait for any necessary data
  setTimeout(() => {
    isLoading.value = false;
  }, 800); // Show skeleton for 800ms
});

// Form data
const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const termsAccepted = ref(false);
const showPassword = ref(false);

// Validation rules
const rules = {
  required: requiredRule(),
  email: emailRule(),
  password: minLengthRule(8, 'Password must be at least 8 characters'),
  passwordMatch: passwordMatchRule(() => password.value, 'Passwords do not match'),
  termsRequired: requiredRule('You must agree to the terms to continue')
};

// Handle registration submission
const handleRegister = async () => {
  const { valid } = await form.value.validate();
  
  if (valid) {
    const success = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      device_name: navigator.userAgent
    });
    
    if (success) {
      router.push('/');
    }
  }
};
</script>
