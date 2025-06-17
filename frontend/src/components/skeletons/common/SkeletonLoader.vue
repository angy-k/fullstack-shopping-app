<template>
  <div class="skeleton-loader">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  height: {
    type: [String, Number],
    default: 'auto'
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  borderRadius: {
    type: [String, Number],
    default: '4px'
  },
  animation: {
    type: String,
    default: 'wave', // 'wave' or 'pulse'
    validator: (value) => ['wave', 'pulse'].includes(value)
  }
});
</script>

<style scoped>
.skeleton-loader {
  position: relative;
  overflow: hidden;
  background-color: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: v-bind(borderRadius);
  width: v-bind(width);
  height: v-bind(height);
}

.skeleton-loader::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: v-bind('animation === "wave" ? "shimmer 2s infinite" : "pulse 1.5s infinite"');
  content: '';
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}

/* Dark mode adjustments */
:deep(.v-theme--dark) .skeleton-loader {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>
