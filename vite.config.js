import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from '@vitejs/plugin-basic-ssl'

import fs from 'fs';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
  ],
  server: {
    port: 8081,
    host: true,
  },
})
