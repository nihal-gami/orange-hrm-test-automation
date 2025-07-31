import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * Handles environment preparation and cleanup
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Global Setup for Orange HRM Test Automation');
  
  try {
    // Launch browser for environment validation
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🌐 Validating test environment connectivity...');
    
    // Verify the Orange HRM demo site is accessible
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Verify basic page elements are loaded
    const usernameField = page.locator('[name="username"]');
    const passwordField = page.locator('[name="password"]');
    const loginButton = page.locator('[type="submit"]');

    await usernameField.waitFor({ state: 'visible', timeout: 10000 });
    await passwordField.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });

    console.log('✅ Environment validation completed successfully');

    // Test basic login functionality to ensure API is working
    await usernameField.fill('Admin');
    await passwordField.fill('admin123');
    await loginButton.click();

    // Wait for dashboard to load
    await page.waitForURL('**/dashboard/**', { timeout: 15000 });
    
    const dashboardTitle = page.locator('.oxd-topbar-header-breadcrumb h6');
    await dashboardTitle.waitFor({ state: 'visible', timeout: 10000 });

    console.log('✅ Basic login functionality verified');

    // Clean up
    await browser.close();

    // Create required directories for test artifacts
    await ensureDirectoriesExist();

    console.log('🎯 Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw new Error(`Environment setup failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Ensure required directories exist for test artifacts
 */
async function ensureDirectoriesExist() {
  const fs = await import('fs');
  const path = await import('path');

  const directories = [
    'test-results',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces'
  ];

  for (const dir of directories) {
    const fullPath = path.resolve(dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${fullPath}`);
    }
  }
}

export default globalSetup; 