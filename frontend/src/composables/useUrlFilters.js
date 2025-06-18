import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Composable for syncing filter state with URL query parameters
 * @param {Object} defaultFilters - Default filter values
 * @returns {Object} - Filters and utility functions
 */
export function useUrlFilters(defaultFilters = {}) {
  const route = useRoute()
  const router = useRouter()

  // Initialize filters with defaults
  const filters = ref({
    category: null,
    minPrice: null,
    maxPrice: null,
    minStock: null,
    search: null,
    sortBy: null,
    sortDir: null,
    page: 1,
    perPage: 12,
    ...defaultFilters,
  })

  /**
   * Update URL with current filters
   */
  const updateUrlFromFilters = () => {
    const cleanFilters = {}

    Object.entries(filters.value).forEach(([key, value]) => {
      // Keep 0 values for minPrice
      if (key === 'minPrice' && (value === 0 || value === '0')) {
        cleanFilters[key] = value
        return
      }

      // Skip null, undefined, or empty string values
      if (value === null || value === undefined || value === '') {
        return
      }

      cleanFilters[key] = value
    })

    // Update URL without triggering a navigation
    router.replace(
      {
        query: cleanFilters,
      },
      { preserveState: true },
    )
  }

  /**
   * Update filters from URL query parameters
   */
  const updateFiltersFromUrl = () => {
    const query = route.query

    // Update filters from URL query parameters
    if (query.category) filters.value.category = query.category
    if (query.minPrice !== undefined)
      filters.value.minPrice = Number(query.minPrice)
    if (query.maxPrice !== undefined)
      filters.value.maxPrice = Number(query.maxPrice)
    if (query.minStock !== undefined)
      filters.value.minStock = Number(query.minStock)
    if (query.search !== undefined) filters.value.search = query.search
    if (query.sortBy !== undefined) filters.value.sortBy = query.sortBy
    if (query.sortDir !== undefined) filters.value.sortDir = query.sortDir
    if (query.page !== undefined) filters.value.page = Number(query.page)
    if (query.perPage !== undefined)
      filters.value.perPage = Number(query.perPage)
  }

  /**
   * Update a single filter value
   * @param {string} key - Filter key
   * @param {any} value - Filter value
   */
  const updateFilter = (key, value) => {
    if (key in filters.value) {
      filters.value[key] = value
      updateUrlFromFilters()
    }
  }

  /**
   * Reset all filters to default values
   */
  const resetFilters = () => {
    Object.keys(filters.value).forEach(key => {
      if (key === 'page') {
        filters.value[key] = 1
      } else if (key === 'perPage') {
        filters.value[key] = 12
      } else {
        filters.value[key] = null
      }
    })

    // Apply any custom defaults
    if (defaultFilters) {
      Object.entries(defaultFilters).forEach(([key, value]) => {
        filters.value[key] = value
      })
    }

    updateUrlFromFilters()
  }

  // Watch for route query changes
  watch(
    () => route.query,
    () => {
      updateFiltersFromUrl()
    },
    { deep: true },
  )

  // Initialize filters from URL on mount
  onMounted(() => {
    updateFiltersFromUrl()
  })

  return {
    filters,
    updateFilter,
    resetFilters,
    updateUrlFromFilters,
  }
}
