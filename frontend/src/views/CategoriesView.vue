<template>
  <v-container class="custom-container">
    <h1 class="text-h4 mb-6">Categories</h1>
    
    <!-- Categories Grid -->
    <v-row v-if="loading">
      <v-col v-for="i in 6" :key="`skeleton-${i}`" cols="12" sm="6" md="4">
        <CategoryCardSkeleton />
      </v-col>
    </v-row>
    
    <v-row v-else-if="categories.length > 0">
      <v-col v-for="category in categories" :key="category.id" cols="12" sm="6" md="4">
        <CategoryCard :category="category" />
      </v-col>
    </v-row>
    
    <v-row v-else class="text-center">
      <v-col cols="12">
        <v-alert type="info">
          No categories found.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import CategoryCard from '@/components/categories/CategoryCard.vue';
import CategoryCardSkeleton from '@/components/skeletons/ui/CategoryCardSkeleton.vue';

const categoryStore = useCategoryStore();

// State
const loading = ref(true);
const categories = ref([]);

// Methods
const fetchCategories = async () => {
  try {
    await categoryStore.fetchCategories();
    categories.value = categoryStore.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    loading.value = false;
  }
};

// Initialize component
onMounted(async () => {
  await fetchCategories();
});
</script>

<style scoped>
.custom-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 16px;
}

.h-100 {
  height: 100%;
}
</style>
