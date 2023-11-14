import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: process.env.DIDPAY_BACKEND_URL || 'http://localhost:8080',
      }
    },
  },
  define: {
    'process.env.COMMIT_HASH': 
      process.env.COMMIT_HASH ? JSON.stringify(process.env.COMMIT_HASH) : undefined,
  }
})
