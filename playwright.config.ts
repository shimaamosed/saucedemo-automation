import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
  ['html', { open: 'never' }],
  ['allure-playwright', { resultsDir: 'allure-results' }],
],

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    testIdAttribute: 'data-test'
  },

projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
],

});

