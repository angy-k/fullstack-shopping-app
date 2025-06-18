<template>
  <v-card class="h-100" elevation="2">
    <!-- Title skeleton -->
    <v-card-title>
      <v-skeleton-loader type="text" width="70%" />
    </v-card-title>
    
    <!-- Description skeleton -->
    <v-card-text>
      <v-skeleton-loader type="text" width="90%" />
      <v-skeleton-loader type="text" width="80%" class="mt-2" />
    </v-card-text>
    
    <!-- Button skeleton -->
    <v-card-actions class="d-flex justify-end">
      <v-skeleton-loader type="button" width="120px" />
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
