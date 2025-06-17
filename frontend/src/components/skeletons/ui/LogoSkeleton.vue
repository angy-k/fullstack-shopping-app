<template>
  <div class="d-flex justify-center">
    <skeleton-loader
      height="40px"
      :width="
        size === 'large' ? '240px' : size === 'medium' ? '200px' : '160px'
      "
      border-radius="4px"
    />
  </div>
</template>

<script setup>
import SkeletonLoader from '@/components/skeletons/common/SkeletonLoader.vue'

defineProps({
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: value => ['small', 'medium', 'large'].includes(value),
  },
})
</script>
