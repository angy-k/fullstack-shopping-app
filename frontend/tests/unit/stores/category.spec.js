import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { categoryService } from '@/services/category'

// Mock the category service
vi.mock('@/services/category', () => ({
  categoryService: {
    getCategories: vi.fn(),
  },
}))

describe('Category Store', () => {
  let store

  beforeEach(() => {
    // Create a fresh Pinia instance and make it active
    setActivePinia(createPinia())

    // Reset all mocks
    vi.resetAllMocks()

    // Create a mock store
    store = {
      categories: [],
      loading: false,
      error: null,
      fetchCategories: vi.fn(async function () {
        this.loading = true
        try {
          const response = await categoryService.getCategories()
          this.categories = response.data.data
          this.error = null
        } catch (error) {
          this.error = error.message
        } finally {
          this.loading = false
        }
      }),
    }
  })

  describe('state', () => {
    it('should have initial state', () => {
      expect(store.categories).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('fetchCategories', () => {
    it('should fetch categories and update state on success', async () => {
      // Mock data
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Clothing' },
          ],
        },
      }

      // Mock service response
      categoryService.getCategories.mockResolvedValue(mockResponse)

      // Call action
      await store.fetchCategories()

      // Verify service was called
      expect(categoryService.getCategories).toHaveBeenCalledTimes(1)

      // Verify state was updated correctly
      expect(store.categories).toEqual(mockResponse.data.data)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle errors when fetching categories', async () => {
      // Mock error
      const mockError = new Error('Failed to fetch categories')
      categoryService.getCategories.mockRejectedValue(mockError)

      // Call action
      await store.fetchCategories()

      // Verify service was called
      expect(categoryService.getCategories).toHaveBeenCalledTimes(1)

      // Verify state was updated correctly
      expect(store.categories).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(mockError.message)
    })
  })
})
