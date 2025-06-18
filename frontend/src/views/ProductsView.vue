<template>
  <v-container class="custom-container">
    <h1 class="text-h4 mb-6">Products</h1>

    <!-- Filters and Search -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="filters.search"
          label="Search products"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="debouncedFetchProducts"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.category"
          :items="categories"
          item-title="name"
          item-value="id"
          label="Category"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          return-object
          @update:model-value="onCategoryChange"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.sortBy"
          :items="sortOptions"
          label="Sort by"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="fetchProducts"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filters.sortDir"
          :items="sortDirections"
          label="Sort direction"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="fetchProducts"
        ></v-select>
      </v-col>
    </v-row>

    <v-row class="mb-6" style="align-items: center">
      <v-col cols="12" md="6">
        <!-- Unified price range layout for all screen sizes -->
        <div class="price-filter-container">
          <div>
            <div class="price-filter-label pb-2">Price range</div>
            <div class="price-filter-inputs">
              <v-text-field
                v-model="filters.minPrice"
                type="number"
                hide-details
                density="compact"
                variant="outlined"
                prefix="$"
                class="price-input"
                @change="updatePriceRange"
              ></v-text-field>

              <div class="price-range-divider">to</div>

              <v-text-field
                v-model="filters.maxPrice"
                type="number"
                hide-details
                density="compact"
                variant="outlined"
                prefix="$"
                class="price-input"
                @change="updatePriceRange"
              ></v-text-field>
            </div>
          </div>
          <v-range-slider
            v-model="priceRange"
            :min="0"
            :max="1000"
            :step="10"
            thumb-label="always"
            hide-details
            class="mt-1 price-slider"
            color="primary"
            track-color="primary"
            @end="fetchProducts"
            style="align-self: end"
          ></v-range-slider>
        </div>
      </v-col>

      <v-col cols="12" md="3" style="align-self: end">
        <v-text-field
          v-model="filters.minStock"
          type="number"
          label="Min stock"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="debouncedFetchProducts"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Products Grid -->
    <v-row v-if="loading">
      <v-col
        v-for="i in 12"
        :key="`skeleton-${i}`"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCardSkeleton />
      </v-col>
    </v-row>

    <v-row v-else-if="products.length > 0">
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>

    <v-row v-else class="text-center">
      <v-col cols="12">
        <v-alert type="info">
          No products found matching your criteria.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-row v-if="pagination.total > 0" class="mt-6">
      <v-col cols="12" class="d-flex justify-center">
        <v-pagination
          v-model="pagination.currentPage"
          :length="pagination.totalPages"
          :total-visible="7"
          @update:model-value="fetchProducts"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ProductCard from '@/components/products/ProductCard.vue'
import ProductCardSkeleton from '@/components/skeletons/ui/ProductCardSkeleton.vue'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'

// Custom debounce function
function debounce(fn, delay) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

const productStore = useProductStore()
const categoryStore = useCategoryStore()

// State
const loading = ref(true)
const products = ref([])
const categories = ref([])
const pagination = ref({
  currentPage: 1,
  perPage: 12,
  total: 0,
  totalPages: 0,
})

const filters = ref({
  search: '',
  category: null, // Will hold the full category object
  sortBy: 'created_at',
  sortDir: 'desc',
  minPrice: 0,
  maxPrice: 1000,
  minStock: null,
})

// Keep track of selected category ID for API calls
const selectedCategoryId = ref(null)

const priceRange = ref([0, 1000])

// Computed
const sortOptions = [
  { title: 'Name', value: 'title' },
  { title: 'Price', value: 'price' },
  { title: 'Stock', value: 'stock_quantity' },
  { title: 'Newest', value: 'created_at' },
]

const sortDirections = [
  { title: 'Ascending', value: 'asc' },
  { title: 'Descending', value: 'desc' },
]

// Handle category change from dropdown
const onCategoryChange = category => {
  // Update the category filter with the full category object
  filters.value.category = category

  // Update the selectedCategoryId for API calls
  selectedCategoryId.value = category ? category.id : null

  // Update URL to reflect the category change
  updateUrlWithFilters()

  // Fetch products with the new category filter
  fetchProducts()
}

// Update URL with current filters without reloading the page
const updateUrlWithFilters = () => {
  const urlParams = new URLSearchParams(window.location.search)

  // Update category parameter
  if (selectedCategoryId.value) {
    urlParams.set('category', selectedCategoryId.value)
  } else {
    urlParams.delete('category')
  }

  // Update other parameters if needed
  if (filters.value.search) {
    urlParams.set('search', filters.value.search)
  } else {
    urlParams.delete('search')
  }

  // Update URL without reloading the page
  const newUrl =
    window.location.pathname +
    (urlParams.toString() ? `?${urlParams.toString()}` : '')
  window.history.pushState({}, '', newUrl)
}

// Methods
const fetchProducts = async () => {
  loading.value = true

  try {
    const response = await productStore.fetchProducts({
      page: pagination.value.currentPage,
      perPage: pagination.value.perPage,
      search: filters.value.search,
      category: selectedCategoryId.value, // Use the ID for API calls
      sortBy: filters.value.sortBy,
      sortDir: filters.value.sortDir,
      minPrice: filters.value.minPrice,
      maxPrice: filters.value.maxPrice,
      minStock: filters.value.minStock,
    })

    products.value = response.data
    pagination.value.total = response.meta.total
    pagination.value.totalPages = response.meta.last_page
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    await categoryStore.fetchCategories()
    categories.value = categoryStore.categories

    // If a category ID was set from URL params, find the category object
    if (selectedCategoryId.value) {
      // Make sure the category ID is treated as a string for comparison
      const categoryId = String(selectedCategoryId.value)
      // Find the category object that matches the ID
      const selectedCategory = categories.value.find(
        cat => String(cat.id) === categoryId,
      )

      if (selectedCategory) {
        console.log(
          `Found category: ${selectedCategory.name} for ID: ${categoryId}`,
        )
        // Set the full category object for the v-select
        filters.value.category = selectedCategory
      } else {
        console.warn(`Category with ID ${categoryId} not found`)
        // Clear the category filter if the ID is invalid
        filters.value.category = null
        selectedCategoryId.value = null
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const debouncedFetchProducts = debounce(fetchProducts, 500)

const updatePriceRange = () => {
  priceRange.value = [
    parseInt(filters.value.minPrice),
    parseInt(filters.value.maxPrice),
  ]
  fetchProducts()
}

// Watch for price range changes
watch(priceRange, newVal => {
  filters.value.minPrice = newVal[0]
  filters.value.maxPrice = newVal[1]
})

// Parse URL parameters on component mount
const parseUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)

  // Check for category parameter
  const categoryParam = urlParams.get('category')
  if (categoryParam) {
    // Store the category ID for API calls
    selectedCategoryId.value = categoryParam

    // Find the matching category object in the categories array
    const categoryId = String(categoryParam)
    const selectedCategory = categories.value.find(
      cat => String(cat.id) === categoryId,
    )

    if (selectedCategory) {
      // Set the full category object for the v-select
      filters.value.category = selectedCategory
    } else {
      // If category not found yet (categories might not be loaded),
      // we'll handle this after categories are loaded in fetchCategories()
      console.log(
        `Category ID ${categoryId} found in URL, waiting for categories to load`,
      )
    }
  }

  // Check for other parameters if needed
  const searchParam = urlParams.get('search')
  if (searchParam) {
    filters.value.search = searchParam
  }

  const minPriceParam = urlParams.get('minPrice')
  if (minPriceParam) {
    filters.value.minPrice = parseInt(minPriceParam)
    priceRange.value[0] = parseInt(minPriceParam)
  }

  const maxPriceParam = urlParams.get('maxPrice')
  if (maxPriceParam) {
    filters.value.maxPrice = parseInt(maxPriceParam)
    priceRange.value[1] = parseInt(maxPriceParam)
  }

  const minStockParam = urlParams.get('minStock')
  if (minStockParam) {
    filters.value.minStock = parseInt(minStockParam)
  }
}

// Lifecycle
onMounted(async () => {
  // First fetch categories so we have them available
  await fetchCategories()

  // Then parse URL parameters which might include category ID
  parseUrlParams()

  // Finally fetch products with the parsed filters
  await fetchProducts()
})
</script>

<style scoped>
.custom-container {
  max-width: 1440px !important;
  margin: 0 auto;
  padding: 16px;
}

.price-filter-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.price-filter-label {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--v-theme-on-surface);
  opacity: 0.7;
}

.price-filter-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  width: 100%;
}

.price-input {
  min-width: 90px !important;
  max-width: calc(50% - 16px);
  flex: 1;
}

.price-range-divider {
  width: 24px;
  text-align: center;
  color: var(--v-theme-on-surface);
  opacity: 0.7;
  flex-shrink: 0;
}

.price-slider {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding: 0 8px;
}

@media (max-width: 600px) {
  .price-filter-inputs {
    gap: 4px;
  }

  .price-range-divider {
    width: 16px;
  }
}
</style>
