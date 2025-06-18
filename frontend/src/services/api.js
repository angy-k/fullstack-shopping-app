/**
 * API client for the backend
 */

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Ensure API_URL doesn't have a trailing slash
const normalizedApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL

/**
 * Handles API requests with automatic JSON parsing and error handling
 * @param {string} endpoint - API endpoint (without the base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${normalizedApiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  }

  // Add auth token if available
  const token = localStorage.getItem('auth_token')
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Add CSRF token from cookies if available
  const cookies = document.cookie.split(';')
  const xsrfCookie = cookies.find(cookie =>
    cookie.trim().startsWith('XSRF-TOKEN='),
  )
  if (xsrfCookie) {
    const xsrfToken = decodeURIComponent(xsrfCookie.split('=')[1])
    headers['X-XSRF-TOKEN'] = xsrfToken
  }

  // Include credentials for cookies/session
  const config = {
    ...options,
    headers,
    credentials: 'include',
  }

  try {
    const response = await fetch(url, config)

    // Parse JSON response
    const data = await response.json()

    // Handle API errors
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors,
        data,
      }
    }

    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('API request failed:', error)
    throw error
  }
}

/**
 * API client with methods for common HTTP verbs
 */
export const api = {
  /**
   * GET request with cache prevention
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @param {boolean} noCache - Whether to add cache prevention headers
   * @returns {Promise<any>}
   */
  get: (endpoint, options = {}, noCache = true) => {
    // Add cache prevention headers if noCache is true
    const headers = options.headers || {}
    
    if (noCache) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
      headers['Pragma'] = 'no-cache'
      headers['Expires'] = '0'
    }
    
    return apiRequest(endpoint, { 
      ...options, 
      headers,
      method: 'GET' 
    })
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  post: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  put: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  patch: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>}
   */
  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
}

export default api
