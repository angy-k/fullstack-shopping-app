<template>
  <v-card
    :to="`/products?category=${category.id}`"
    class="h-100"
    elevation="2"
    hover
  >
    <v-card-title class="text-capitalize">{{ category.name }}</v-card-title>
    <v-card-text v-if="category.description">
      {{ category.description }}
    </v-card-text>
    <v-card-text v-else class="text-body-2 text-medium-emphasis">
      Browse products in this category
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        color="primary"
        variant="text"
        :to="`/products?category=${category.id}`"
      >
        Browse Products
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
    validator: value => {
      return value && value.id && value.name
    },
  },
})
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
