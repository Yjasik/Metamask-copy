import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    // Разрешаем запросы с chrome-extension://, включая порты
    cors: {
      origin: /chrome-extension:\/\//
    },
    // Чётко указываем хост для HMR, чтобы не было подмены
    hmr: {
      host: 'localhost'
    }
  },
  publicDir: 'public',
})