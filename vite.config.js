import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All /api/* requests from the React app are forwarded to Express :5001
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        // Uncomment below if you need to rewrite the path:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

