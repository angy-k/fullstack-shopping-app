import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import { authService } from '@/services/auth'

/**
 * Authentication store for managing user state
 * Handles login, logout, and user information
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  /**
   * Initialize auth state from localStorage or session
   */
  async function init() {
    if (token.value) {
      try {
        loading.value = true
        const response = await authService.getUser()
        user.value = response
        loading.value = false
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch user data:', err)
        user.value = null
        token.value = null
        authService.removeToken()
        loading.value = false
        error.value = 'Session expired. Please login again.'
      }
    }
  }

  /**
   * Login user with credentials
   */
  async function login(credentials) {
    try {
      loading.value = true
      error.value = null

      // Login with credentials
      const response = await authService.login(credentials)

      // Set user and token
      user.value = response.user

      // Store token if provided
      if (response.token) {
        token.value = response.token
        authService.setToken(response.token)
      }

      loading.value = false
      return true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', err)
      loading.value = false
      error.value =
        err.message || 'Login failed. Please check your credentials.'
      return false
    }
  }

  /**
   * Logout current user
   */
  async function logout() {
    try {
      loading.value = true
      await authService.logout()
      user.value = null
      token.value = null
      authService.removeToken()
      loading.value = false
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Logout failed:', err)
      // Still clear user data even if API call fails
      user.value = null
      token.value = null
      authService.removeToken()
      loading.value = false
    }
  }

  /**
   * Register a new user
   */
  async function register(userData) {
    try {
      loading.value = true
      error.value = null

      // Register user with authService
      const response = await authService.register(userData)

      // Set user and token directly from registration response
      user.value = response.user

      if (response.token) {
        token.value = response.token
        authService.setToken(response.token)
      }

      loading.value = false
      return true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Registration failed:', err)
      loading.value = false
      error.value = err.message || 'Registration failed. Please try again.'
      return false
    }
  }

  /**
   * Request password reset email
   */
  async function forgotPassword(email) {
    try {
      loading.value = true
      error.value = null

      // Get CSRF cookie first
      await authService.getCsrfCookie()

      // Send password reset request
      await api.post('/auth/forgot-password', { email })

      loading.value = false
      return true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Password reset request failed:', err)
      loading.value = false
      error.value =
        err.response?.data?.message || 'Failed to send password reset email'
      throw err
    }
  }

  /**
   * Reset user password with token
   */
  async function resetPassword(resetData) {
    try {
      loading.value = true
      error.value = null

      // Get CSRF cookie first
      await authService.getCsrfCookie()

      // Send password reset request
      await api.post('/auth/reset-password', resetData)

      loading.value = false
      return true
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Password reset failed:', err)
      loading.value = false
      error.value = err.response?.data?.message || 'Failed to reset password'
      throw err
    }
  }

  // Initialize on store creation
  init()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    init,
  }
})
