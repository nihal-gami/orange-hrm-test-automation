import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { validCredentials, urls, timeouts } from '../data/auth-test-data';

/**
 * Test Suite: Valid Login with Correct Credentials
 * Jira Task: HRM-60
 * 
 * This test suite verifies that users can successfully login 
 * to Orange HRM with valid credentials and access the dashboard.
 * 
 * Following automation rules:
 * - Single browser testing (Chrome)
 * - Page Object Model implementation
 * - Data-driven testing approach
 */

test.describe('HRM-60: Valid Login with Correct Credentials', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Navigate to login page before each test
    await loginPage.navigateToLogin();
  });

  test('should successfully login with valid admin credentials', async ({ page }) => {
    // Test Step 1: Verify login page is displayed
    await loginPage.verifyLoginFormDisplayed();
    await loginPage.verifyOrangeHrmLogo();
    
    // Test Step 2: Enter valid username
    await loginPage.enterUsername(validCredentials.username);
    
    // Test Step 3: Enter valid password
    await loginPage.enterPassword(validCredentials.password);
    
    // Test Step 4: Click login button
    await loginPage.clickLogin();
    
    // Test Step 5: Verify successful login and dashboard access
    await dashboardPage.verifySuccessfulLogin();
    
    // Additional Verifications
    await expect(page).toHaveURL(/.*dashboard.*/);
    await expect(dashboardPage.dashboardTitle).toHaveText('Dashboard');
    await dashboardPage.verifyUserProfilePicture();
    await dashboardPage.verifySidebarMenu();
    
    // Verify dashboard widgets are loaded
    await dashboardPage.verifyDashboardWidgets();
  });

  test('should maintain session after successful login', async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Navigate to different module and back to dashboard
    await dashboardPage.navigateToPIM();
    await page.waitForURL(/.*pim.*/);
    
    // Navigate back to dashboard
    await dashboardPage.dashboardMenuItem.click();
    await dashboardPage.waitForDashboardLoad();
    
    // Verify session is maintained
    await dashboardPage.verifySuccessfulLogin();
  });

  test('should display correct user information after login', async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Verify user dropdown is accessible
    await dashboardPage.clickUserDropdown();
    
    // Verify logout option is visible (indicates proper session)
    await expect(dashboardPage.logoutOption).toBeVisible();
    
    // Close dropdown by clicking elsewhere
    await dashboardPage.dashboardTitle.click();
  });

  test('should load all expected menu items for admin user', async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Get all visible menu items
    const visibleMenuItems = await dashboardPage.getVisibleMenuItems();
    
    // Verify expected menu items are present
    const expectedMenuItems = [
      'Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 
      'My Info', 'Performance', 'Dashboard', 'Directory'
    ];
    
    for (const expectedItem of expectedMenuItems) {
      expect(visibleMenuItems.some(item => 
        item.toLowerCase().includes(expectedItem.toLowerCase())
      )).toBeTruthy();
    }
  });

  test('should handle page refresh after successful login', async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify user is still logged in after refresh
    await dashboardPage.verifySuccessfulLogin();
  });

  test('should successfully navigate between modules after login', async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Test navigation to different modules
    const moduleTests = [
      { method: () => dashboardPage.navigateToAdmin(), urlPattern: /.*admin.*/ },
      { method: () => dashboardPage.navigateToPIM(), urlPattern: /.*pim.*/ },
      { method: () => dashboardPage.navigateToLeave(), urlPattern: /.*leave.*/ },
      { method: () => dashboardPage.navigateToMyInfo(), urlPattern: /.*myinfo.*/ }
    ];
    
    for (const moduleTest of moduleTests) {
      await moduleTest.method();
      await expect(page).toHaveURL(moduleTest.urlPattern);
      
      // Navigate back to dashboard
      await dashboardPage.dashboardMenuItem.click();
      await dashboardPage.waitForDashboardLoad();
    }
  });

  test.afterEach(async ({ page }) => {
    // Take screenshot for test documentation
    await page.screenshot({ 
      path: `test-results/screenshots/valid-login-${test.info().title}-${Date.now()}.png`,
      fullPage: true 
    });
  });
}); 