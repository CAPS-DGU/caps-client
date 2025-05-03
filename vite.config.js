import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl';
import mkcert from 'vite-plugin-mkcert';

import fs from 'fs';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  basicSsl(),
  ],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://api.dgucaps.shop/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true
      }
    }
  }
})
