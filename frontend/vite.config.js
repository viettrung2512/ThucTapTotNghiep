import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    // Thêm proxy tại đây
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Trỏ đến BE port 8080
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
