<template>
  <v-card class="product-card h-100" :to="`/products/${product.id}`">
    <v-img
      :src="product.image_url"
      :alt="product.title"
      height="200"
      :aspect-ratio="1"
      class="product-image"
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

    <v-card-item>
      <v-card-title class="text-subtitle-1 text-truncate">{{
        product.title
      }}</v-card-title>
      <v-card-subtitle>
        <v-chip size="small" color="primary" class="mr-2">{{
          product.category.name
        }}</v-chip>
        <span class="font-weight-bold">${{ product.price.toFixed(2) }}</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="product-description">
      <div class="text-truncate-2">{{ product.description }}</div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-cart"
        @click.stop="addToCart"
      >
        Add to Cart
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useDisplay } from 'vuetify'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const cartStore = useCartStore()
const { mobile } = useDisplay()

const addToCart = event => {
  event.preventDefault()
  cartStore.addToCart(props.product)
  
  // Show snackbar or other feedback could be added here
}
</script>

<style scoped>
.product-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  transition: opacity 0.3s;
  background-color: var(--v-theme-surface-variant);
}

.product-card:hover .product-image {
  opacity: 0.9;
}

.product-image :deep(img) {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  padding: 8px;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
