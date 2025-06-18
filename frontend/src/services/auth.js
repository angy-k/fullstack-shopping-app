/**
 * Authentication service for handling user authentication
 */
import { api } from './api'

/**
 * Authentication service with methods for login, registration, and user management
 */
export const authService = {
  /**
   * Get CSRF cookie for CSRF protection
   * @returns {Promise<void>}
   */
  getCsrfCookie: async () => {
    // Extract the base URL without the /api suffix
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl

    // Make sure to wait for the response
    const response = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch CSRF cookie:', response.status)
      throw new Error('Failed to fetch CSRF cookie')
    }

    // Small delay to ensure cookie is set
    await new Promise(resolve => setTimeout(resolve, 100))

    return response
  },

  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} - User data and token
   */
  login: async credentials => {
    // Get CSRF cookie first
    await authService.getCsrfCookie()

    // Then login
    return api.post('auth/login', credentials)
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.password_confirmation - Password confirmation
   * @returns {Promise<Object>} - User data and token
   */
  register: async userData => {
    // Get CSRF cookie first
    await authService.getCsrfCookie()

    // Then register
    return api.post('auth/register', userData)
  },

  /**
   * Logout the current user
   * @returns {Promise<Object>} - Logout response
   */
  logout: () => {
    return api.post('auth/logout')
  },

  /**
   * Get the current authenticated user
   * @returns {Promise<Object>} - User data
   */
  getUser: () => {
    return api.get('auth/user')
  },

  /**
   * Check if the user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token')
  },

  /**
   * Set authentication token in localStorage
   * @param {string} token - Authentication token
   */
  setToken: token => {
    localStorage.setItem('auth_token', token)
  },

  /**
   * Get authentication token from localStorage
   * @returns {string|null} - Authentication token or null
   */
  getToken: () => {
    return localStorage.getItem('auth_token')
  },

  /**
   * Remove authentication token from localStorage
   */
  removeToken: () => {
    localStorage.removeItem('auth_token')
  },
}

export default authService
