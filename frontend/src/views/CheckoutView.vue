<template>
  <div class="checkout-container mx-auto">
    <h1 class="text-h4 mb-6">Checkout</h1>

    <div v-if="cartStore.items.length === 0" class="text-center">
      <v-card class="pa-6 text-center mb-6">
        <v-icon size="64" color="grey" class="mb-4">mdi-cart-outline</v-icon>
        <h2 class="text-h5 mb-2">Your cart is empty</h2>
        <p class="text-body-1 mb-4">
          You need to add items to your cart before checking out.
        </p>
        <v-btn color="primary" to="/products" prepend-icon="mdi-shopping">
          Browse Products
        </v-btn>
      </v-card>
    </div>

    <v-form v-else ref="form" v-model="valid" @submit.prevent="submitOrder">
      <div class="d-flex flex-column flex-md-row gap-6">
        <!-- Shipping Information -->
        <div class="flex-grow-1">
          <v-card class="mb-6">
            <v-card-title class="text-h6 bg-primary text-white py-3 px-4">
              Shipping Information
            </v-card-title>
            <v-card-text>
              <p class="text-subtitle-1 mb-4">
                Hello, <strong>{{ user?.name || 'User' }}</strong>! Please confirm your shipping details below.
              </p>
              
              <v-text-field
                v-model="shippingInfo.address"
                label="Address"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shippingInfo.city"
                    label="City"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="shippingInfo.postalCode"
                    label="Postal Code"
                    :rules="[rules.required]"
                    variant="outlined"
                    density="comfortable"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="shippingInfo.country"
                label="Country"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
              
              <v-text-field
                v-model="shippingInfo.phone"
                label="Phone Number"
                :rules="[rules.required]"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-card class="mb-6">
            <v-card-title class="text-h6 bg-primary text-white py-3 px-4">
              Payment Instructions
            </v-card-title>
            <v-card-text>
              <v-alert
                color="info"
                icon="mdi-information"
                class="mb-3"
                variant="tonal"
              >
                <p class="text-subtitle-1 font-weight-medium mb-2">Payment will be processed after order confirmation</p>
                <p class="mb-0">You will receive payment instructions via email after submitting your order. We accept bank transfers and major credit cards.</p>
              </v-alert>
              
              <v-alert
                color="warning"
                icon="mdi-clock-outline"
                variant="tonal"
              >
                <p class="text-subtitle-1 font-weight-medium mb-1">Processing Time</p>
                <p class="mb-0">Orders are typically processed within 1-2 business days after payment confirmation.</p>
              </v-alert>
            </v-card-text>
          </v-card>
        </div>

        <!-- Order Summary -->
        <div class="checkout-sidebar">
          <v-card class="mb-4">
            <v-card-title class="text-h6 bg-primary text-white py-3 px-4">
              Order Summary
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list>
                <v-list-item
                  v-for="item in cartStore.items"
                  :key="item.id"
                  :title="item.title"
                  :subtitle="`Quantity: ${item.quantity}`"
                >
                  <template v-slot:prepend>
                    <v-avatar size="40" rounded>
                      <v-img :src="item.image_url" cover></v-img>
                    </v-avatar>
                  </template>
                  <template v-slot:append>
                    ${{ (item.price * item.quantity).toFixed(2) }}
                  </template>
                </v-list-item>
              </v-list>

              <v-divider></v-divider>

              <div class="pa-4">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-subtitle-1">Subtotal:</span>
                  <span class="text-subtitle-1">${{ cartStore.totalPrice.toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-subtitle-1">Shipping:</span>
                  <span class="text-subtitle-1">Free</span>
                </div>
                <v-divider class="my-3"></v-divider>
                <div
                  class="d-flex justify-space-between text-h6 font-weight-bold"
                >
                  <span>Total:</span>
                  <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-btn
            color="primary"
            size="large"
            block
            type="submit"
            :loading="loading"
            :disabled="!valid || loading"
          >
            Place Order
          </v-btn>
          <v-btn
            color="secondary"
            variant="text"
            block
            class="mt-2"
            :to="{ name: 'Cart' }"
            prepend-icon="mdi-arrow-left"
          >
            Return to Cart
          </v-btn>
        </div>
      </div>
    </v-form>

    <!-- Success Dialog -->
    <v-dialog v-model="orderSuccessDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 bg-success text-center py-4">
          <v-icon color="white" size="large" class="mr-2">mdi-check-circle</v-icon>
          <span class="white--text">Order Placed Successfully!</span>
        </v-card-title>
        <v-card-text class="pa-6 text-center">
          <p class="text-body-1 mb-4">
            Thank you for your order! Your order number is
            <strong>#{{ orderNumber }}</strong>.
          </p>
          <p class="text-body-2 mb-6">
            We've sent a confirmation email to {{ shippingInfo.email }}. You'll
            receive another notification when your order ships.
          </p>
          <v-btn
            color="primary"
            block
            @click="finishOrder"
            size="large"
          >
            Continue Shopping
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()
const form = ref(null)
const valid = ref(false)
const loading = ref(false)

const user = computed(() => authStore.user)
const router = useRouter()
const orderSuccessDialog = ref(false)
const orderNumber = ref('')

const shippingInfo = ref({
  address: '',
  city: '',
  postalCode: '',
  country: '',
  phone: '',
})

const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => /.+@.+\..+/.test(v) || 'Please enter a valid email',
  creditCard: (v) => /^\d{4}(\s\d{4}){3}$|^\d{16}$/.test(v) || 'Please enter a valid card number',
  expiryDate: (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) || 'Please use MM/YY format',
  cvv: (v) => /^\d{3,4}$/.test(v) || 'CVV must be 3 or 4 digits',
}

const submitOrder = async () => {
  const isValid = await form.value?.validate()
  
  if (!isValid?.valid) return
  
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate random order number
    orderNumber.value = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Show success dialog
    orderSuccessDialog.value = true
    
  } catch (error) {
    console.error('Error processing order:', error)
    // Handle error (could show error dialog)
  } finally {
    loading.value = false
  }
}

const finishOrder = () => {
  // Clear cart
  cartStore.clearCart()
  
  // Close dialog
  orderSuccessDialog.value = false
  
  // Redirect to home page
  router.push('/')
}
</script>

<style scoped>
.checkout-container {
  max-width: 1440px;
  padding: 0 16px;
}

.checkout-sidebar {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 959px) {
  .checkout-sidebar {
    max-width: 100%;
  }
}
</style>
