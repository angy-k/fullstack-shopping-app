<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4">
          <!-- App Logo Skeleton -->
          <div class="mb-2">
            <logo-skeleton size="medium" />
          </div>

          <!-- Title Skeleton -->
          <div class="d-flex justify-center mb-6">
            <skeleton-loader height="30px" width="180px" border-radius="4px" />
          </div>

          <!-- Form Fields Skeletons -->
          <div class="mb-6">
            <skeleton-loader height="56px" border-radius="4px" class="mb-4" />
            <skeleton-loader height="56px" border-radius="4px" class="mb-4" />
          </div>

          <!-- Button Skeleton -->
          <skeleton-loader height="48px" border-radius="4px" class="mb-4" />

          <!-- Back to Login Link Skeleton -->
          <div class="d-flex justify-center mt-4">
            <skeleton-loader height="20px" width="140px" border-radius="4px" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import SkeletonLoader from '@/components/skeletons/common/SkeletonLoader.vue'
import LogoSkeleton from '@/components/skeletons/ui/LogoSkeleton.vue'
</script>
