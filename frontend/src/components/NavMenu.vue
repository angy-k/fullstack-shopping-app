<template>
  <div class="d-flex align-center">
    <v-btn
      v-for="item in filteredItems"
      :key="item.title"
      :to="item.to"
      variant="text"
      class="mx-1 nav-btn indigo-lighten-2--text"
      :ripple="false"
      :elevation="0"
    >
      <template v-if="item.title === 'Cart' && productCount > 0">
        {{ item.title }}
        <v-badge
          :content="productCount"
          color="primary"
          inline
          class="ml-1"
          location="top end"
          offset-x="6"
          offset-y="-5"
          style="left: calc(100% - 6px);"
        ></v-badge>
      </template>
      <template v-else>
        {{ item.title }}
      </template>
    </v-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const cartStore = useCartStore()
const productCount = computed(() => cartStore.productCount)

// Filter out the Cart item for desktop view since we're showing it separately
const filteredItems = computed(() => {
  return props.items.filter(item => item.title !== 'Cart')
})
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
