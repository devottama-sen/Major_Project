import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listens on 0.0.0.0 for LAN / Wi-Fi access
    port: 5173,
    proxy: {
      // Forward all /api requests to the Express backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Forward WebSocket connections for voice (Step 4)
      '/ws': {
        target: 'ws://localhost:5000',
        ws: true,
      },
    },
  },
})
