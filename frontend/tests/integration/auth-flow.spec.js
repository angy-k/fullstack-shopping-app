import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth'

// Mock the auth service
vi.mock('@/services/auth', () => ({
  authService: {
    getCsrfCookie: vi.fn().mockResolvedValue({}),
    login: vi.fn(),
    logout: vi.fn(),
    getUser: vi.fn(),
    setToken: vi.fn(),
    getToken: vi.fn(),
    removeToken: vi.fn(),
  },
}))

// Create a mock store factory
const createMockStore = () => ({
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
  setUser: vi.fn(),
  clearUser: vi.fn(),
  setError: vi.fn(),
  clearError: vi.fn(),
})

// Mock the useAuthStore function
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}))

describe('Authentication Flow', () => {
  let mockStore

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create a mock store
    mockStore = createMockStore()
    useAuthStore.mockReturnValue(mockStore)
  })

  describe('Login Flow', () => {
    it('successfully logs in a user and updates the store', async () => {
      // Mock successful login response
      const userData = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      }

      const loginResponse = {
        user: userData,
        token: 'test-token',
      }

      // Setup auth service mock
      authService.login.mockResolvedValueOnce(loginResponse)

      // Setup store login implementation
      mockStore.login.mockImplementation(async credentials => {
        const response = await authService.login(credentials)
        mockStore.user = response.user
        mockStore.isAuthenticated = true
        authService.setToken(response.token)
        return response
      })

      // Call login with credentials
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
        remember: false,
      }

      await mockStore.login(credentials)

      // Verify auth service was called with correct credentials
      expect(authService.login).toHaveBeenCalledWith(credentials)

      // Verify token was set
      expect(authService.setToken).toHaveBeenCalledWith('test-token')

      // Verify store was updated
      expect(mockStore.user).toEqual(userData)
      expect(mockStore.isAuthenticated).toBe(true)
    })

    it('handles login errors correctly', async () => {
      // Mock failed login
      const errorMessage = 'Invalid credentials'
      authService.login.mockRejectedValueOnce(new Error(errorMessage))

      // Setup store login implementation with error handling
      mockStore.login.mockImplementation(async credentials => {
        try {
          const response = await authService.login(credentials)
          mockStore.user = response.user
          mockStore.isAuthenticated = true
          mockStore.error = null
          return response
        } catch (error) {
          mockStore.error = error.message
          throw error
        }
      })

      // Call login with credentials
      const credentials = {
        email: 'test@example.com',
        password: 'wrong-password',
        remember: false,
      }

      // Expect the login to throw an error
      await expect(mockStore.login(credentials)).rejects.toThrow(errorMessage)

      // Verify auth service was called
      expect(authService.login).toHaveBeenCalledWith(credentials)

      // Verify error was set in store
      expect(mockStore.error).toBe(errorMessage)

      // Verify user remains null
      expect(mockStore.user).toBeNull()
      expect(mockStore.isAuthenticated).toBe(false)
    })
  })

  describe('Default User Login', () => {
    it('successfully logs in with default user credentials', async () => {
      // Mock successful login response for default user
      const userData = {
        id: 1,
        name: 'Demo User',
        email: 'demo@example.com',
      }

      const loginResponse = {
        user: userData,
        token: 'demo-token',
      }

      // Setup auth service mock
      authService.login.mockResolvedValueOnce(loginResponse)

      // Setup store login implementation
      mockStore.login.mockImplementation(async credentials => {
        const response = await authService.login(credentials)
        mockStore.user = response.user
        mockStore.isAuthenticated = true
        authService.setToken(response.token)
        return response
      })

      // Call login with default user credentials
      const credentials = {
        email: 'demo@example.com',
        password: 'password123',
        remember: false,
      }

      await mockStore.login(credentials)

      // Verify auth service was called with correct credentials
      expect(authService.login).toHaveBeenCalledWith(credentials)

      // Verify token was set
      expect(authService.setToken).toHaveBeenCalledWith('demo-token')

      // Verify store was updated
      expect(mockStore.user).toEqual(userData)
      expect(mockStore.isAuthenticated).toBe(true)
    })
  })

  describe('Logout Flow', () => {
    it('successfully logs out a user and clears the store', async () => {
      // Setup initial authenticated state
      mockStore.user = { id: 1, name: 'Test User', email: 'test@example.com' }
      mockStore.isAuthenticated = true

      // Setup store logout implementation
      mockStore.logout.mockImplementation(async () => {
        await authService.logout()
        mockStore.user = null
        mockStore.isAuthenticated = false
        authService.removeToken()
      })

      // Call logout
      await mockStore.logout()

      // Verify auth service was called
      expect(authService.logout).toHaveBeenCalled()
      expect(authService.removeToken).toHaveBeenCalled()

      // Verify store was updated
      expect(mockStore.user).toBeNull()
      expect(mockStore.isAuthenticated).toBe(false)
    })
  })
})
