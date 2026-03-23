import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const appSrc = path.resolve(__dirname, './src')

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5175,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': appSrc,
    },
  },
})
