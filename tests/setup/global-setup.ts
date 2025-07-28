import { chromium, FullConfig } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AuthTestData } from '../data/auth-test-data';

async function globalSetup(config: FullConfig) {
  // Create browser and page for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Navigate to login and authenticate
    await loginPage.navigateToLogin();
    await loginPage.loginAndWaitForDashboard(
      AuthTestData.validCredentials.username,
      AuthTestData.validCredentials.password
    );
    
    // Verify login was successful
    await dashboardPage.waitForDashboardLoad();
    
    // Save authentication state
    await page.context().storageState({ path: 'test-data/auth.json' });
    
    console.log('✅ Global setup completed - Authentication state saved');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup; 