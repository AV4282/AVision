import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import http from 'node:http'

// The AdSense script tag lives in index.html, so it is in the built page's
// <head> where Google looks for it. VITE_ADSENSE_CLIENT still decides: it
// replaces the publisher id there, and VITE_ADSENSE_CLIENT="" takes the tag
// out, so a build with ads off asks Google for nothing and sets no ad cookies.
// src/AdSlot.tsx reads the same setting the same way for the ad units.
const adsenseClient = (client: string | undefined): Plugin => ({
  name: 'avision-adsense-client',
  transformIndexHtml: (html) =>
    client === undefined
      ? html
      : client
        ? html.replace(/(adsbygoogle\.js\?client=)[^"]*/, `$1${client}`)
        : html.replace(/\n\s*<!-- Google AdSense[\s\S]*?<\/script>/, ''),
})

// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    adsenseClient(loadEnv(mode, __dirname, 'VITE_').VITE_ADSENSE_CLIENT?.trim()),
  ],
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
}))
