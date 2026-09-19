import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // `host: true` expone el servidor en 0.0.0.0, es decir, en todas las
    // interfaces de red. Gracias a esto puedes abrir la app desde el celular
    // usando la IP local de tu PC (ej. http://192.168.1.35:5173).
    host: true,
    port: 5173,
    strictPort: true,

    // Proxy hacia la API de Express. El celular NUNCA habla directo con el
    // backend: pide /api/... al servidor de Vite y Vite lo reenvía a
    // http://localhost:4000. Así no tienes que configurar IPs en el frontend.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },

  preview: {
    host: true,
    port: 4173,
    // El build de producción también necesita el proxy para hablar con la API.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
