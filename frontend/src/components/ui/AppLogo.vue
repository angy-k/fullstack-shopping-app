<template>
  <router-link 
    to="/" 
    class="text-decoration-none app-logo"
    :ripple="false"
  >
    <h1 :class="[
      'font-weight-bold',
      size === 'large' ? 'text-h3' : 
      size === 'medium' ? 'text-h4' : 
      'text-h5'
    ]"
    :style="{ color: '#1976D2' }"
    >
      Shopping App
    </h1>
  </router-link>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
});
</script>

<style scoped>
.app-logo {
  display: inline-block;
  transition: opacity 0.2s ease;
}

.app-logo:hover {
  opacity: 0.8;
}
</style>
