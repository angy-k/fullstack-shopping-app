<template>
  <v-card class="h-100" elevation="2">
    <!-- Image skeleton -->
    <v-skeleton-loader type="image" height="200px" class="ma-0 pa-0" />

    <!-- Title skeleton -->
    <v-card-title>
      <v-skeleton-loader type="text" width="85%" />
    </v-card-title>

    <!-- Price skeleton -->
    <v-card-subtitle>
      <v-skeleton-loader type="text" width="40%" />
    </v-card-subtitle>

    <!-- Description skeleton -->
    <v-card-text>
      <v-skeleton-loader type="text" width="100%" />
      <v-skeleton-loader type="text" width="90%" class="mt-1" />
      <v-skeleton-loader type="text" width="60%" class="mt-1" />
    </v-card-text>

    <!-- Button skeleton -->
    <v-card-actions class="d-flex justify-space-between">
      <v-skeleton-loader type="button" width="90px" />
      <v-skeleton-loader type="button" width="90px" />
    </v-card-actions>
  </v-card>
</template>

<script setup>
// No props needed for the skeleton
</script>

<style scoped>
.h-100 {
  height: 100%;
}
</style>
