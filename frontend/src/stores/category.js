import { defineStore } from 'pinia';
import { categoryService } from '@/services/category';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    category: null,
    loading: false,
    error: null
  }),
  
  actions: {
    /**
     * Fetch all categories
     * @returns {Promise} - API response
     */
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await categoryService.getCategories();
        this.categories = response.data.data || response.data;
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch categories';
        console.error('Error fetching categories:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Fetch a single category by ID
     * @param {number|string} id - Category ID
     * @returns {Promise} - API response
     */
    async fetchCategory(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await categoryService.getCategory(id);
        this.category = response.data.data || response.data;
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch category';
        console.error(`Error fetching category ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
