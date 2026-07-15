import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Host configurable: por defecto 0.0.0.0 (LAN + Render).
// Local tótem: http://192.168.88.127:5173
// Opcional: VITE_DEV_HOST=192.168.88.127
const DEV_HOST = process.env.VITE_DEV_HOST || '0.0.0.0'

export default defineConfig({
  plugins: [react()],
  server: {
    host: DEV_HOST,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
    strictPort: false,
    allowedHosts: true,
  },
})
