<template>
  <div class="not-found-container">
    <div class="not-found-content text-center">
      <!-- Image Circle Skeleton -->
      <div class="d-flex justify-center mb-6">
        <skeleton-loader height="200px" width="200px" border-radius="50%" />
      </div>
      
      <!-- 404 Number Skeleton -->
      <div class="d-flex justify-center mb-4">
        <skeleton-loader height="40px" width="80px" border-radius="4px" />
      </div>
      
      <!-- Error Message Skeleton -->
      <div class="mb-4">
        <skeleton-loader height="32px" width="80%" class="mx-auto mb-2" />
      </div>
      
      <!-- Subtitle Skeleton -->
      <div class="mb-8">
        <skeleton-loader height="20px" width="60%" class="mx-auto" />
      </div>
      
      <!-- Button Skeleton -->
      <div class="d-flex justify-center">
        <skeleton-loader height="48px" width="180px" border-radius="4px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from '@/components/skeletons/common/SkeletonLoader.vue';
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
}

.not-found-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
