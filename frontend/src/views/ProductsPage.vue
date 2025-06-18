<template>
  <div class="products-page">
    <div class="custom-container">
      <h1>Products</h1>

      <!-- Filter controls -->
      <div class="filters">
        <div class="filter-group">
          <v-select
            v-model="filters.category"
            :items="categoryItems"
            label="Category"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="
              handleFilterChange('category', filters.category)
            "
          ></v-select>
        </div>

        <!-- Unified price range layout for all screen sizes -->
        <div class="price-range-group md-col-3">
          <div class="price-filter-label mb-2">Price Range</div>
          <div class="price-inputs">
            <v-text-field
              v-model.number="filters.minPrice"
              type="number"
              hide-details
              density="compact"
              variant="outlined"
              prefix="$"
              placeholder="Min"
              class="price-input"
              @update:model-value="
                handleFilterChange('minPrice', filters.minPrice)
              "
            ></v-text-field>

            <div class="price-range-divider">to</div>

            <v-text-field
              v-model.number="filters.maxPrice"
              type="number"
              hide-details
              density="compact"
              variant="outlined"
              prefix="$"
              placeholder="Max"
              class="price-input"
              @update:model-value="
                handleFilterChange('maxPrice', filters.maxPrice)
              "
            ></v-text-field>
          </div>
        </div>

        <div class="filter-group min-stock-filter">
          <v-text-field
            v-model.number="filters.minStock"
            label="Min Stock"
            type="number"
            hide-details
            density="compact"
            variant="outlined"
            @update:model-value="
              handleFilterChange('minStock', filters.minStock)
            "
          ></v-text-field>
        </div>

        <div class="filter-group">
          <v-text-field
            v-model="filters.search"
            label="Search"
            hide-details
            density="compact"
            variant="outlined"
            placeholder="Search products..."
            prepend-inner-icon="mdi-magnify"
            @input="debounceSearch"
          ></v-text-field>
        </div>

        <v-btn
          @click="resetFilters"
          class="reset-btn mt-2"
          variant="outlined"
          color="error"
          size="small"
          prepend-icon="mdi-refresh"
        >
          Reset Filters
        </v-btn>
      </div>

      <!-- Sorting controls -->
      <div class="sorting">
        <div class="sort-group">
          <v-select
            v-model="filters.sortBy"
            :items="sortOptions"
            label="Sort By"
            hide-details
            density="compact"
            variant="outlined"
            @update:model-value="handleFilterChange('sortBy', filters.sortBy)"
          ></v-select>
        </div>

        <div class="sort-group" v-if="filters.sortBy">
          <v-select
            v-model="filters.sortDir"
            :items="sortDirections"
            label="Order"
            hide-details
            density="compact"
            variant="outlined"
            @update:model-value="handleFilterChange('sortDir', filters.sortDir)"
          ></v-select>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading">Loading products...</div>

      <!-- Error state -->
      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <!-- Products list -->
      <div v-else class="products-grid">
        <div v-if="products.length === 0" class="no-products">
          No products found matching your criteria.
        </div>
        <div
          v-else
          v-for="product in products"
          :key="product.id"
          class="product-card"
        >
          <h3>{{ product.title }}</h3>
          <p class="price">${{ product.price.toFixed(2) }}</p>
          <p class="stock">In stock: {{ product.stock_quantity }}</p>
        </div>
      </div>

      <!-- Pagination controls -->
      <div class="pagination">
        <v-btn
          :disabled="pagination.currentPage <= 1"
          @click="handleFilterChange('page', pagination.currentPage - 1)"
          variant="outlined"
          density="comfortable"
          size="small"
          prepend-icon="mdi-chevron-left"
        >
          Previous
        </v-btn>

        <span class="page-info">
          Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
        </span>

        <v-btn
          :disabled="pagination.currentPage >= pagination.totalPages"
          @click="handleFilterChange('page', pagination.currentPage + 1)"
          variant="outlined"
          density="comfortable"
          size="small"
          append-icon="mdi-chevron-right"
        >
          Next
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { useUrlFilters } from '@/composables/useUrlFilters'

// Initialize stores and composables
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const { filters, updateFilter, resetFilters } = useUrlFilters()

// Reactive refs
const loading = computed(() => productStore.loading)
const error = computed(() => productStore.error)
const products = computed(() => productStore.products)
const categories = ref([])
const pagination = computed(() => productStore.pagination)

// Computed properties for select options
const categoryItems = computed(() => {
  const items = [{ title: 'All Categories', value: null }]
  if (categories.value && categories.value.length) {
    categories.value.forEach(category => {
      items.push({ title: category.name, value: category.id })
    })
  }
  return items
})

const sortOptions = [
  { title: 'Default', value: null },
  { title: 'Price', value: 'price' },
  { title: 'Name', value: 'title' },
  { title: 'Date Added', value: 'created_at' },
]

const sortDirections = [
  { title: 'Ascending', value: 'asc' },
  { title: 'Descending', value: 'desc' },
]

// Search debounce
let searchTimeout = null
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    updateFilter('search', filters.value.search)
    fetchProducts()
  }, 300)
}

// Handle filter changes
const handleFilterChange = (key, value) => {
  // Reset to page 1 when changing filters (except when changing page)
  if (key !== 'page') {
    updateFilter('page', 1)
  }

  updateFilter(key, value)
  fetchProducts()
}

// Fetch products with current filters
const fetchProducts = async () => {
  try {
    await productStore.fetchProducts(filters.value)
  } catch (err) {
    console.error('Failed to fetch products:', err)
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    await categoryStore.fetchCategories()
    categories.value = categoryStore.categories
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

// Initialize component
onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
})
</script>

<style scoped>
.products-page {
  padding: 20px;
}

.custom-container {
  max-width: 1440px !important;
  margin: 0 auto;
  padding: 16px;
}

.filters,
.sorting {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.filter-group,
.sort-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  width: 100%;
  max-width: 250px;
}

.price-range-group {
  display: flex;
  flex-direction: column;
  min-width: 220px;
  width: 100%;
  max-width: 350px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  width: 100%;
}

.price-input {
  flex: 1;
  min-width: 90px !important;
}

.price-range-divider {
  flex-shrink: 0;
  width: 24px;
  text-align: center;
  color: var(--v-theme-on-surface);
  opacity: 0.7;
}

.price-filter-label {
  font-size: 0.875rem;
  color: var(--v-theme-on-surface);
  opacity: 0.7;
}

.min-stock-filter {
  align-self: center;
}

.reset-btn {
  align-self: flex-end;
  margin-left: auto;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.page-info {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.price {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.2rem;
}

.stock {
  color: #666;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
}

.loading,
.error,
.no-products {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}

.error {
  color: #f44336;
}
</style>
