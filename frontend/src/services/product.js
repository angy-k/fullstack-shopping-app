/**
 * Product service for handling product-related API calls
 */
import { api } from './api'

/**
 * Product service with methods for fetching products and categories
 */
export const productService = {
  /**
   * Fetch products with filtering, sorting and pagination
   * @param {Object} params - Filter, sort and pagination parameters
   * @returns {Promise<Object>} - Products data with pagination
   */
  getProducts: async (params = {}) => {
    // Filter out null, undefined, and empty string values
    const cleanParams = {}

    // Handle category parameter
    if (
      params.category !== undefined &&
      params.category !== null &&
      params.category !== ''
    ) {
      cleanParams.category = params.category
    }

    // Handle price filtering
    if (
      params.minPrice !== undefined &&
      params.minPrice !== null &&
      params.minPrice !== ''
    ) {
      cleanParams.minPrice = params.minPrice
    }

    if (
      params.maxPrice !== undefined &&
      params.maxPrice !== null &&
      params.maxPrice !== ''
    ) {
      cleanParams.maxPrice = params.maxPrice
    }

    // Handle stock filtering
    if (
      params.minStock !== undefined &&
      params.minStock !== null &&
      params.minStock !== ''
    ) {
      cleanParams.minStock = params.minStock
    }

    // Handle search
    if (
      params.search !== undefined &&
      params.search !== null &&
      params.search !== ''
    ) {
      cleanParams.search = params.search
    }

    // Handle sorting
    if (params.sortBy) {
      cleanParams.sortBy = params.sortBy
      if (params.sortDir) {
        cleanParams.sortDir = params.sortDir
      }
    }

    // Handle pagination
    if (params.page) {
      cleanParams.page = params.page
    }

    if (params.perPage) {
      cleanParams.perPage = params.perPage
    }

    // Convert params to URLSearchParams for query string
    const queryParams = new URLSearchParams()
    for (const [key, value] of Object.entries(cleanParams)) {
      queryParams.append(key, value)
    }

    // Add a timestamp to prevent caching
    queryParams.append('_t', Date.now())

    const queryString = queryParams.toString()
    const endpoint = queryString ? `products?${queryString}` : 'products'

    // Use no-cache headers to prevent caching
    return api.get(endpoint, {}, true)
  },

  /**
   * Fetch a single product by ID
   * @param {number|string} id - Product ID
   * @returns {Promise<Object>} - Product data
   */
  getProduct: id => {
    return api.get(`products/${id}`)
  },

  // Categories are now handled by the category service
}

export default productService
