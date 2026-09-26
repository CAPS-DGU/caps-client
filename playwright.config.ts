import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://127.0.0.1:4179" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command:
      "npm run build && npx vite preview --config tests/preview.config.ts --host 127.0.0.1 --port 4179 --strictPort",
    url: "http://127.0.0.1:4179",
    env: { VITE_API_HOST: "http://127.0.0.1:4179" },
    timeout: 120000,
  },
});
