import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import CommonJs from 'vite-plugin-commonjs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), CommonJs()],
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
      }
    },
  },
  define: {
    global: 'globalThis',
    'process.env.COMMIT_HASH': 
      process.env.COMMIT_HASH ? JSON.stringify(process.env.COMMIT_HASH) : undefined,
  }
})
