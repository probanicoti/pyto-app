import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // During local dev, run `vercel dev` instead for the /api routes to work.
      // This proxy is a fallback if you point VITE_API_BASE at a deployed backend.
    }
  }
})
