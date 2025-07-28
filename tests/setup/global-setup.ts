import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Orange HRM Test Automation Suite');
  console.log('📊 Environment: ' + (process.env.NODE_ENV || 'development'));
  console.log('🌐 Base URL: ' + (config.projects[0].use?.baseURL || 'https://opensource-demo.orangehrmlive.com/'));
  console.log('🔧 Browser: Chrome (Single browser as per testing standards)');
  
  // Verify the application is accessible
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🔍 Verifying application accessibility...');
    await page.goto('https://opensource-demo.orangehrmlive.com/', { waitUntil: 'networkidle' });
    
    // Check if login page is loaded correctly
    const loginTitle = await page.locator('h5').textContent();
    if (loginTitle?.includes('Login')) {
      console.log('✅ Application is accessible and login page is loaded');
    } else {
      throw new Error('Login page not loaded correctly');
    }
  } catch (error) {
    console.error('❌ Application accessibility check failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
  
  console.log('🎯 Global setup completed successfully');
  console.log('📋 Test execution will begin...\n');
}

export default globalSetup; 