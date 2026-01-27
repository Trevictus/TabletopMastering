import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Permitir todos los hosts para Docker
    allowedHosts: true,
    // Configuración HMR para compatibilidad con proxies y navegadores restrictivos
    hmr: {
      clientPort: 80,
      host: 'localhost',
      protocol: 'ws',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173
  },
  // Optimización para mejor compatibilidad
  build: {
    target: 'es2020',
    sourcemap: false,
  },
})
