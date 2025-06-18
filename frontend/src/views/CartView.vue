<template>
  <div class="cart-container mx-auto">
    <h1 class="text-h4 mb-6">Shopping Cart</h1>

    <v-card v-if="cartStore.items.length > 0" class="mb-6">
      <v-data-table
        :headers="headers"
        :items="cartStore.items"
        item-value="id"
        class="cart-table"
      >
        <!-- Product Image and Title -->
        <template v-slot:item.product="{ item }">
          <div class="d-flex align-center">
            <v-img
              :src="item.image_url"
              width="60"
              height="60"
              class="rounded mr-4"
              contain
            ></v-img>
            <div>
              <div class="font-weight-medium">{{ item.title }}</div>
            </div>
          </div>
        </template>

        <!-- Price -->
        <template v-slot:item.price="{ item }">
          ${{ item.price.toFixed(2) }}
        </template>

        <!-- Quantity -->
        <template v-slot:item.quantity="{ item }">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-minus"
              size="small"
              variant="text"
              @click="decreaseQuantity(item)"
              :disabled="item.quantity <= 1"
            ></v-btn>
            <span class="mx-2">{{ item.quantity }}</span>
            <v-btn
              icon="mdi-plus"
              size="small"
              variant="text"
              @click="increaseQuantity(item)"
            ></v-btn>
          </div>
        </template>

        <!-- Subtotal -->
        <template v-slot:item.subtotal="{ item }">
          ${{ (item.price * item.quantity).toFixed(2) }}
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            variant="text"
            @click="removeItem(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-card v-else class="pa-6 text-center mb-6">
      <v-icon size="64" color="grey" class="mb-4">mdi-cart-outline</v-icon>
      <h2 class="text-h5 mb-2">Your cart is empty</h2>
      <p class="text-body-1 mb-4">
        Looks like you haven't added any products to your cart yet.
      </p>
      <v-btn color="primary" to="/products" prepend-icon="mdi-shopping">
        Continue Shopping
      </v-btn>
    </v-card>

    <div v-if="cartStore.items.length > 0" class="mt-6">
      <v-card class="order-summary-card">
        <v-card-title class="text-h6 bg-primary text-white py-3 px-4">
          Order Summary
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="d-flex justify-space-between mb-2">
            <span class="text-subtitle-1">Subtotal:</span>
            <span class="text-subtitle-1">${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span class="text-subtitle-1">Shipping:</span>
            <span class="text-subtitle-1">Free</span>
          </div>
          <v-divider class="my-3"></v-divider>
          <div class="d-flex justify-space-between font-weight-bold">
            <span class="text-h6">Total:</span>
            <span class="text-h6">${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-2">
          <div class="action-buttons-container">
            <v-btn
              v-if="isAuthenticated"
              color="primary"
              block
              class="mb-3 py-6"
              :to="{ name: 'Checkout' }"
              prepend-icon="mdi-cash-register"
              size="large"
              elevation="3"
            >
              <span class="text-button font-weight-bold">Proceed to Checkout</span>
            </v-btn>
            <v-btn
              v-else
              color="primary"
              block
              class="mb-3 py-6"
              :to="{ name: 'Login', query: { redirect: '/checkout' } }"
              prepend-icon="mdi-login"
              size="large"
              elevation="3"
            >
              <span class="text-button font-weight-bold">Login to Checkout</span>
            </v-btn>
            <v-btn
              color="secondary"
              variant="tonal"
              block
              to="/products"
              prepend-icon="mdi-arrow-left"
              class="py-4"
              size="large"
            >
              <span class="text-button">Continue Shopping</span>
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const headers = [
  {
    title: 'Product',
    key: 'product',
    align: 'start',
    sortable: false,
    width: '40%',
  },
  { title: 'Price', key: 'price', align: 'center', width: '15%' },
  { title: 'Quantity', key: 'quantity', align: 'center', width: '20%' },
  { title: 'Subtotal', key: 'subtotal', align: 'center', width: '15%' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false, width: '10%' },
]

const increaseQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.quantity + 1)
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1)
  }
}

const removeItem = (item) => {
  cartStore.removeFromCart(item.id)
}
</script>

<style scoped>
.cart-container {
  max-width: 1440px;
  padding: 0 16px;
}

.order-summary-card {
  border: 2px solid var(--v-primary-base);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  max-width: 500px;
  margin: 0 auto;
}

.action-buttons-container {
  width: 100%;
}

.order-summary {
  width: 100%;
  max-width: 350px;
}

.action-buttons {
  width: 100%;
  max-width: 350px;
}

@media (min-width: 600px) {
  .action-buttons {
    margin-left: 16px;
  }
}

.cart-table :deep(th) {
  font-weight: 500 !important;
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
}
</style>
