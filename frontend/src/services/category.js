/**
 * Category service for handling category-related API calls
 */
import { api } from './api'

/**
 * Category service with methods for fetching categories
 */
export const categoryService = {
  /**
   * Fetch all categories
   * @returns {Promise<Object>} - Categories data
   */
  getCategories: async () => {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    return api.get(`/categories?_=${timestamp}`);
  },
};

export default categoryService;
