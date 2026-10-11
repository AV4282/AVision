import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import http from 'node:http'

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
    strictPort: true,
    // AVision ticket API (api/ folder, uvicorn on port 8000). 127.0.0.1, not localhost:
    // uvicorn listens on IPv4 only, and Node may resolve localhost to ::1.
    // keepAlive reuses connections; on some Windows setups, a fresh connection per
    // request intermittently fails with ECONNRESET.
    proxy: {
      // Ticket photos. Local and live share one database, so they share one photo
      // store too: the live server's. Otherwise a photo posted from a laptop would
      // only exist on that laptop and show as broken for everyone else.
      // Set PHOTO_PROXY_TARGET=local to keep photos on your own API instead.
      // Listed before '/api' because the first matching rule wins.
      ...(process.env.PHOTO_PROXY_TARGET === 'local'
        ? {}
        : {
            '/api/uploads': {
              target: process.env.PHOTO_PROXY_TARGET || 'https://atlantamamdani.photo',
              changeOrigin: true,
            },
          }),
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:8000',
        rewrite: (p) => p.replace(/^\/api/, ''),
        agent: new http.Agent({ keepAlive: true }),
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
  },
})
