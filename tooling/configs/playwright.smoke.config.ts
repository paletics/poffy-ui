import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './packages/react/src',
  testMatch: '**/KeyboardInteractions.e2e.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'chromium-smoke',
      use: { ...devices['Desktop Chrome'], reducedMotion: 'reduce' },
    },
    {
      name: 'firefox-smoke',
      use: { ...devices['Desktop Firefox'], reducedMotion: 'reduce' },
    },
    {
      name: 'webkit-smoke',
      use: { ...devices['Desktop Safari'], reducedMotion: 'reduce' },
    },
  ],
  webServer: {
    command: 'pnpm storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
