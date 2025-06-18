import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    deps: {
      inline: ['vuetify']
    },
    root: '.'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
  },
})
