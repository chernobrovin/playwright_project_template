import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 7_500 },
  reporter: [
    ['list'],
    ['html', {
      outputFolder: process.env.PLAYWRIGHT_HTML_OUTPUT_DIR ?? 'playwright-report',
      open: 'never',
    }],
  ],
  use: {
    baseURL: process.env.BOOKING_ORIGIN ?? 'https://book.natodi.com',
    locale: 'uk-UA',
    timezoneId: 'Europe/Kyiv',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  outputDir: process.env.TEST_RESULTS_DIR ?? 'test-results',
});
