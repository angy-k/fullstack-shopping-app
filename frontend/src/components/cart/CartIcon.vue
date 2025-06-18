<template>
  <v-btn
    :to="{ name: 'Cart' }"
    variant="text"
    class="mx-1 nav-btn indigo-lighten-2--text position-relative"
    :ripple="false"
    :elevation="0"
  >
    <v-icon>mdi-cart</v-icon>
    <v-badge
      v-if="count > 0"
      :content="count"
      color="primary"
      floating
      dot-size="20"
      offset-x="6"
      offset-y="-8"
      location="top end"
      style="left: calc(100% - 6px);"
    ></v-badge>
  </v-btn>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const count = computed(() => cartStore.count)
</script>

<style scoped>
.nav-btn {
  box-shadow: none !important;
  border: none !important;
  position: relative;
  font-weight: 500;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: rgb(var(--v-theme-indigo-lighten-2));
  transition: width 0.3s ease;
}

.nav-btn:hover::after,
.nav-btn.router-link-active::after {
  width: 70%;
}
</style>
