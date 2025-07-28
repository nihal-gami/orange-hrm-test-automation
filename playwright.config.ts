import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Global timeout for all actions
    actionTimeout: 15000,
    
    // Global timeout for navigation
    navigationTimeout: 30000
  },

  // Configure projects for major browsers - Chrome only as per automation standards
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Additional Chrome-specific settings
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true
      },
    }
  ],

  // Global setup file
  globalSetup: './tests/setup/global-setup.ts',

  // Configure test output directory
  outputDir: 'test-results/',
  
  // Configure test timeout
  timeout: 60000,
  
  // Configure expect timeout
  expect: {
    timeout: 10000
  }
}); 