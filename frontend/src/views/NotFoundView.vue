<template>
  <not-found-skeleton v-if="isLoading" />
  <div v-else class="not-found-container">
    <div class="not-found-content text-center">
      <!-- 404 Image with Empty Cart -->
      <div class="image-container mb-2">
        <div class="image-circle">
          <v-img
            :src="emptyCartImage"
            alt="404 - Page Not Found"
            cover
            height="200"
            width="200"
            class="rounded-circle"
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
        </div>
      </div>

      <!-- 404 Text below image -->
      <div class="text-h3 font-weight-bold mb-4 primary--text">404</div>

      <!-- Error message -->
      <h1 class="text-h4 font-weight-medium mb-4">
        This page is unknown or does not exist
      </h1>
      <p class="text-subtitle-1 text-medium-emphasis mb-8">
        Sorry about that, but the page you're looking for is unavailable
      </p>

      <!-- Action buttons -->
      <div class="actions-container">
        <v-btn
          color="indigo-lighten-2"
          size="large"
          to="/"
          class="mr-4"
          variant="flat"
        >
          Go to Home Page
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NotFoundSkeleton from '@/components/skeletons/ui/NotFoundSkeleton.vue'
import emptyCartImage from '@/assets/images/empty-cart.jpeg'

const isLoading = ref(true)

onMounted(() => {
  document.title = '404 - Page Not Found | Shopping App'

  // Simulate loading time or wait for any necessary data
  setTimeout(() => {
    isLoading.value = false
  }, 500) // Show skeleton for 500ms
})
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: var(--v-theme-spacing-6);
  background-color: var(--v-theme-background);
}

.not-found-content {
  max-width: 500px;
  width: 100%;
  align-container: center;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.image-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
}

/* Error overlay removed as 404 text is now below the image */

.actions-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .image-circle {
    width: 160px;
    height: 160px;
  }

  .error-overlay .text-h3 {
    font-size: 1.75rem !important;
  }

  .actions-container {
    flex-direction: column;
    align-items: center;
  }

  .actions-container .v-btn {
    width: 100%;
    margin-right: 0 !important;
  }
}
</style>
