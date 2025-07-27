import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  preview: {
    port: parseInt(process.env.PORT || '4173'),
    strictPort: true,
    host: true,
  },
})
