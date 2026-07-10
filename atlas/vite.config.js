import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on the LAN so phones on the same Wi-Fi can connect
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5178',
    },
  },
})
