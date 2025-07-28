import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🔧 Starting Global Test Setup...');
  
  // Create screenshots directory
  const screenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Verify Orange HRM application is accessible
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Verifying Orange HRM application accessibility...');
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
      timeout: 30000,
      waitUntil: 'networkidle'
    });
    
    // Check if login page elements are present
    const usernameField = page.locator('[name="username"]');
    const passwordField = page.locator('[name="password"]');
    const loginButton = page.locator('[type="submit"]');
    
    await usernameField.waitFor({ state: 'visible', timeout: 10000 });
    await passwordField.waitFor({ state: 'visible', timeout: 10000 });
    await loginButton.waitFor({ state: 'visible', timeout: 10000 });
    
    console.log('✅ Orange HRM application is accessible and ready for testing');
    
    // Verify admin login credentials work
    await usernameField.fill('Admin');
    await passwordField.fill('admin123');
    await loginButton.click();
    
    // Wait for dashboard to load
    await page.waitForSelector('.oxd-topbar-header-breadcrumb', { timeout: 15000 });
    console.log('✅ Admin credentials verified successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw new Error(`Failed to verify Orange HRM application: ${error}`);
  } finally {
    await browser.close();
  }
  
  console.log('🚀 Global Test Setup completed successfully!');
}

export default globalSetup; 