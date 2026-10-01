import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/downloads',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4177' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: [
    { command: 'python tests/mock_download_server.py', url: 'http://127.0.0.1:4178/health' },
    {
      command: 'npm run build && npx vite preview --config tests/download-preview.config.ts --host 127.0.0.1 --port 4177 --strictPort',
      url: 'http://127.0.0.1:4177', timeout: 120000,
      env: { VITE_API_HOST: 'http://127.0.0.1:4178' },
    },
  ],
});
