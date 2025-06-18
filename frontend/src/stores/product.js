import { defineStore } from 'pinia'
import { productService } from '@/services/product'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 12,
    },
  }),

  actions: {
    /**
     * Fetch products with filtering, sorting and pagination
     * @param {Object} params - Filter, sort and pagination parameters
     * @returns {Promise} - API response
     */
    async fetchProducts(params = {}) {
      this.loading = true
      this.error = null

      try {
        const response = await productService.getProducts(params)
        this.products = response.data.data

        // Update pagination information
        if (response.data.meta) {
          this.pagination = {
            currentPage: response.data.meta.current_page,
            totalPages: response.data.meta.last_page,
            totalItems: response.data.meta.total,
            perPage: response.data.meta.per_page,
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch products'
        console.error('Error fetching products:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch a single product by ID
     * @param {number|string} id - Product ID
     * @returns {Promise} - API response
     */
    async fetchProduct(id) {
      this.loading = true
      this.error = null

      try {
        const response = await productService.getProduct(id)
        this.product = response.data
        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch product'
        console.error(`Error fetching product ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
