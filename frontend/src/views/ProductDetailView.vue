<template>
  <v-container class="custom-container">
    <v-row v-if="loading">
      <v-col cols="12">
        <v-skeleton-loader
          type="image, article, actions"
          height="500"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <template v-else-if="product">
      <v-row>
        <v-col cols="12">
          <v-btn
            prepend-icon="mdi-arrow-left"
            variant="text"
            to="/products"
            class="mb-4"
            :elevation="0"
          >
            Back to Products
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-img
            :src="product.image_url"
            :alt="product.title"
            height="400"
            class="rounded-lg product-detail-image"
            contain
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-col>

        <v-col cols="12" md="6">
          <h1 class="text-h4 mb-2">{{ product.title }}</h1>

          <v-chip color="primary" class="mb-4" size="small">
            {{ product.category.name }}
          </v-chip>

          <div class="text-h5 mb-4 font-weight-bold">
            ${{ product.price.toFixed(2) }}
          </div>

          <div class="mb-6">
            <p class="text-body-1">{{ product.description }}</p>
          </div>

          <div class="d-flex align-center mb-4">
            <span class="text-subtitle-1 mr-4">Quantity:</span>
            <v-text-field
              v-model="quantity"
              type="number"
              min="1"
              :max="product.stock_quantity"
              density="compact"
              style="max-width: 100px"
              class="mr-4"
              :rules="[v => !!v || 'Required', v => v > 0 || 'Must be at least 1', v => v <= product.stock_quantity || `Maximum ${product.stock_quantity}`]"
              :disabled="addingToCart"
              @blur="validateQuantity"
              hide-details="auto"
            ></v-text-field>

            <span class="text-caption">
              {{ product.stock_quantity }} in stock
            </span>
          </div>
          
          <v-alert
            v-if="showSuccessMessage"
            color="success"
            icon="mdi-check-circle"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="showSuccessMessage = false"
          >
            Product added to cart successfully!
          </v-alert>

          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-cart"
            block
            @click="addToCart"
            :loading="addingToCart"
            :disabled="addingToCart"
          >
            Add to Cart
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <v-row v-else>
      <v-col cols="12">
        <v-alert type="error">
          Product not found or an error occurred.
        </v-alert>

        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          to="/products"
          class="mt-4"
          :elevation="0"
        >
          Back to Products
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const addingToCart = ref(false)
const showSuccessMessage = ref(false)

const fetchProduct = async () => {
  loading.value = true

  try {
    const response = await productStore.fetchProduct(route.params.id)
    product.value = response.data
  } catch (error) {
    console.error('Error fetching product details:', error)
  } finally {
    loading.value = false
  }
}

const validateQuantity = () => {
  if (!product.value) return
  
  let qty = parseInt(quantity.value)
  
  // Handle invalid input
  if (isNaN(qty) || qty < 1) {
    quantity.value = 1
  } else if (qty > product.value.stock_quantity) {
    quantity.value = product.value.stock_quantity
  }
}

const addToCart = async () => {
  if (!product.value) return
  
  // Validate quantity
  validateQuantity()
  
  addingToCart.value = true
  
  try {
    await cartStore.addToCart(product.value, parseInt(quantity.value))
    showSuccessMessage.value = true
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
    
    // Reset quantity to 1 after adding to cart
    quantity.value = 1
  } catch (error) {
    console.error('Error adding product to cart:', error)
  } finally {
    addingToCart.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.custom-container {
  max-width: 1440px !important;
  margin: 0 auto;
  padding: 16px;
}

.product-detail-image {
  background-color: var(--v-theme-surface-variant);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-detail-image :deep(img) {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  padding: 16px;
}
</style>
