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
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
            </template>
          </v-img>
        </v-col>
        
        <v-col cols="12" md="6">
          <h1 class="text-h4 mb-2">{{ product.title }}</h1>
          
          <v-chip
            color="primary"
            class="mb-4"
            size="small"
          >
            {{ product.category.name }}
          </v-chip>
          
          <div class="text-h5 mb-4 font-weight-bold">
            ${{ product.price.toFixed(2) }}
          </div>
          
          <div class="mb-6">
            <p class="text-body-1">{{ product.description }}</p>
          </div>
          
          <div class="d-flex align-center mb-6">
            <span class="text-subtitle-1 mr-4">Quantity:</span>
            <v-text-field
              v-model="quantity"
              type="number"
              min="1"
              :max="product.stock_quantity"
              density="compact"
              style="max-width: 100px"
              hide-details
              class="mr-4"
            ></v-text-field>
            
            <span class="text-caption">
              {{ product.stock_quantity }} in stock
            </span>
          </div>
          
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-cart"
            block
            @click="addToCart"
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/product';

const route = useRoute();
const productStore = useProductStore();

const product = ref(null);
const loading = ref(true);
const quantity = ref(1);

const fetchProduct = async () => {
  loading.value = true;
  
  try {
    const response = await productStore.fetchProduct(route.params.id);
    product.value = response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
  } finally {
    loading.value = false;
  }
};

const addToCart = () => {
  // This would be implemented when we add cart functionality
  console.log('Add to cart:', {
    productId: product.value.id,
    quantity: quantity.value
  });
};

onMounted(() => {
  fetchProduct();
});
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
