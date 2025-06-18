<template>
  <div class="d-flex align-center">
    <v-btn
      v-for="item in items"
      :key="item.title"
      :to="item.to"
      variant="text"
      class="mx-1 nav-btn indigo-lighten-2--text"
      :ripple="false"
      :elevation="0"
    >
      {{ item.title }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
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
