import { describe, it, expect, vi, beforeEach } from 'vitest'
import { categoryService } from '@/services/category'
import { api } from '@/services/api'

// Mock the API service
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('Category Service', () => {
  beforeEach(() => {
    // Reset mock between tests
    vi.resetAllMocks()
  })

  describe('getCategories', () => {
    it('should fetch categories with cache busting parameter', async () => {
      // Mock API response
      const mockResponse = {
        data: {
          data: [
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Clothing' },
          ],
        },
      }

      api.get.mockResolvedValue(mockResponse)

      // Call the service method
      const result = await categoryService.getCategories()

      // Verify API was called with cache busting
      expect(api.get).toHaveBeenCalledTimes(1)
      expect(api.get.mock.calls[0][0]).toMatch(/^\/categories\?_=\d+$/)

      // Verify result matches mock response
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors gracefully', async () => {
      // Mock API error
      const mockError = new Error('Network error')
      api.get.mockRejectedValue(mockError)

      // Call the service method and expect it to throw
      await expect(categoryService.getCategories()).rejects.toThrow(
        'Network error',
      )
    })
  })
})
