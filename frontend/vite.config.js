import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Permitir TODOS los hosts (necesario para ngrok con URLs dinámicas)
    allowedHosts: true,
    hmr: {
      protocol: 'wss',
      clientPort: 443,
      host: undefined
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173
  }
})
