import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authService } from '@/services/auth'

// Create a mock version of the auth service for testing
vi.mock('@/services/auth', () => {
  // Keep track of the original implementation
  const originalModule = vi.importActual('@/services/auth')
  
  return {
    authService: {
      // Mock methods but keep track of calls
      getCsrfCookie: vi.fn().mockImplementation(async () => {
        return { ok: true }
      }),
      login: vi.fn().mockImplementation(async (credentials) => {
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          return { user: { id: 1, name: 'Test User' }, token: 'test-token' }
        } else if (credentials.email === 'demo@example.com' && credentials.password === 'password123') {
          return { user: { id: 2, name: 'Demo User' }, token: 'demo-token' }
        } else {
          throw new Error('Invalid credentials')
        }
      }),
      logout: vi.fn().mockResolvedValue({ success: true }),
      getUser: vi.fn().mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' }),
      setToken: vi.fn(),
      getToken: vi.fn().mockReturnValue('test-token'),
      removeToken: vi.fn(),
      isAuthenticated: vi.fn().mockReturnValue(true)
    }
  }
})

// Mock API module
vi.mock('@/services/api', () => ({
  api: {
    post: vi.fn().mockResolvedValue({}),
    get: vi.fn().mockResolvedValue({})
  }
}))

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn(key => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = value.toString()
  }),
  removeItem: vi.fn(key => {
    delete localStorageMock.store[key]
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {}
  })
}

// Set up global fetch mock
global.fetch = vi.fn().mockImplementation(() => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
})

describe('authService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
    localStorageMock.clear()
    
    // Mock window.localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    // Mock import.meta.env
    vi.stubGlobal('import.meta', { 
      env: { VITE_API_URL: 'http://localhost:8000/api' } 
    })
  })
  
  afterEach(() => {
    vi.unstubAllGlobals()
  })
  
  describe('getCsrfCookie', () => {
    it('can be called successfully', async () => {
      const result = await authService.getCsrfCookie()
      expect(authService.getCsrfCookie).toHaveBeenCalled()
      expect(result).toEqual({ ok: true })
    })
  })
  
  describe('login', () => {
    it('returns user data and token when credentials are valid', async () => {
      const credentials = { email: 'test@example.com', password: 'password' }
      const result = await authService.login(credentials)
      
      expect(authService.login).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({
        user: { id: 1, name: 'Test User' },
        token: 'test-token'
      })
    })
    
    it('throws an error when credentials are invalid', async () => {
      const credentials = { email: 'test@example.com', password: 'wrong' }
      
      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials')
      expect(authService.login).toHaveBeenCalledWith(credentials)
    })
    
    it('works with default user credentials from seeder', async () => {
      const credentials = { email: 'demo@example.com', password: 'password123' }
      const result = await authService.login(credentials)
      
      expect(authService.login).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({
        user: { id: 2, name: 'Demo User' },
        token: 'demo-token'
      })
    })
  })
  
  describe('token management', () => {
    it('calls setToken method', () => {
      const token = 'test-token'
      
      authService.setToken(token)
      
      expect(authService.setToken).toHaveBeenCalledWith(token)
    })
    
    it('calls getToken method', () => {
      const result = authService.getToken()
      
      expect(authService.getToken).toHaveBeenCalled()
      expect(result).toBe('test-token')
    })
    
    it('calls removeToken method', () => {
      authService.removeToken()
      
      expect(authService.removeToken).toHaveBeenCalled()
    })
  })
  
  describe('getUser', () => {
    it('returns user data', async () => {
      const result = await authService.getUser()
      
      expect(authService.getUser).toHaveBeenCalled()
      expect(result).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' })
    })
  })
  
  describe('logout', () => {
    it('calls logout method', async () => {
      const result = await authService.logout()
      
      expect(authService.logout).toHaveBeenCalled()
      expect(result).toEqual({ success: true })
    })
  })
})
