import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 프론트(5173)에서 백(3000)으로 프록시 연결
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
