<template>
  <div class="cart-badge-wrapper">
    <v-badge
      v-if="productCount > 0"
      :content="productCount.toString()"
      color="primary"
      location="top end"
      offset-x="6"
      offset-y="-8"
      style="left: calc(100% - 6px);"
    >
      <v-icon>mdi-cart</v-icon>
    </v-badge>
    <v-icon v-else>mdi-cart-outline</v-icon>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const productCount = computed(() => cartStore.productCount)
</script>

<style scoped>
.cart-badge-wrapper {
  position: relative;
  display: inline-flex;
}
</style>
