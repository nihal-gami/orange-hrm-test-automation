import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for test environment
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🔧 Starting global setup...');

  // Create browser instance for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test if Orange HRM demo site is accessible
    console.log('🌐 Testing Orange HRM demo site accessibility...');
    const response = await page.goto('https://opensource-demo.orangehrmlive.com');
    
    if (!response || response.status() !== 200) {
      throw new Error('Orange HRM demo site is not accessible');
    }
    
    console.log('✅ Orange HRM demo site is accessible');

    // Verify login form is present
    await page.waitForSelector('[name="username"]', { timeout: 10000 });
    await page.waitForSelector('[name="password"]', { timeout: 10000 });
    await page.waitForSelector('[type="submit"]', { timeout: 10000 });
    
    console.log('✅ Login form elements verified');

    // Test basic login functionality
    console.log('🔑 Testing basic login functionality...');
    await page.fill('[name="username"]', 'Admin');
    await page.fill('[name="password"]', 'admin123');
    await page.click('[type="submit"]');
    
    // Wait for dashboard or error
    try {
      await page.waitForSelector('.oxd-topbar-header', { timeout: 15000 });
      console.log('✅ Basic login functionality verified');
    } catch (error) {
      console.warn('⚠️ Login might be slow or demo credentials changed');
      // Continue with tests anyway
    }

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('✅ Global setup completed successfully');
}

export default globalSetup; 