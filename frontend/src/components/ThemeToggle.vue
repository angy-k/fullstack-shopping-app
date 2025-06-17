<template>
  <v-btn
    icon
    @click="toggleTheme"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :elevation="0"
  >
    <v-icon v-if="isDark" :color="iconColor">mdi-weather-sunny</v-icon>
    <v-icon v-else :color="iconColor">mdi-weather-night</v-icon>
  </v-btn>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = ref(false)

/**
 * Computed property to ensure icon has good contrast against background
 */
const iconColor = computed(() => {
  return isDark.value ? 'amber-lighten-1' : 'indigo-lighten-2'
})

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  isDark.value = !isDark.value
  theme.global.name.value = isDark.value ? 'darkTheme' : 'lightTheme'

  // Save preference to localStorage
  localStorage.setItem('theme-preference', theme.global.name.value)
}

/**
 * Load user's theme preference or detect system preference
 */
function loadThemePreference() {
  // Check for saved preference
  const savedTheme = localStorage.getItem('theme-preference')

  if (savedTheme) {
    // Use saved preference
    theme.global.name.value = savedTheme
    isDark.value = savedTheme === 'darkTheme'
  } else {
    // Check for system preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    isDark.value = prefersDark
    theme.global.name.value = prefersDark ? 'darkTheme' : 'lightTheme'
  }
}

// Watch for system preference changes
onMounted(() => {
  loadThemePreference()

  // Listen for system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', e => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('theme-preference')) {
        isDark.value = e.matches
        theme.global.name.value = e.matches ? 'darkTheme' : 'lightTheme'
      }
    })
})
</script>

<style scoped>
.theme-toggle-wrapper {
  display: inline-flex;
  align-items: center;
  margin: 0 8px;
}

.theme-toggle-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.theme-toggle-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.theme-icon {
  font-size: 20px;
  line-height: 1;
}

/* Dark theme specific styles */
:deep(.v-theme--darkTheme) .theme-toggle-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
