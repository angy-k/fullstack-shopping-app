import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // API URL from environment variable or fallback
  const apiUrl = env.VITE_API_URL || 'http://localhost:8000'
  
  return {
    plugins: [vue()],
    server: {
      port: 5173,
      host: true,
      // Proxy API requests to backend during development
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      }
    },
  }
})
