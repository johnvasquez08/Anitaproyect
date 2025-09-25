import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import 'dotenv/config'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/rasa': {
        target: process.env.VITE_RASA_URL,  // Variable de entorno para Rasa
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rasa/, ''),  // Elimina /rasa de la ruta
      },
    },
  },
})
