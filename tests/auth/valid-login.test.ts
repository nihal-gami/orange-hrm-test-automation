import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { validCredentials } from '../data/auth-test-data';

/**
 * Test Suite: Valid Login Automation
 * Jira Task: HRM-42 - AUTH-001: Implement Valid Login Test Automation
 * Epic: HRM-41 🔐 Authentication & Authorization
 */

test.describe('Valid Login Tests @auth', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Navigate to login page
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageLoaded();
  });

  test('AUTH-001.1: Should successfully login with valid Admin credentials', async ({ page }) => {
    // Test data
    const { username, password } = validCredentials;

    try {
      // Perform login
      await loginPage.login(username, password);

      // Verify successful login and redirect to dashboard
      await dashboardPage.verifyDashboardLoaded();
      
      // Verify dashboard title
      const dashboardTitle = await dashboardPage.getDashboardTitle();
      expect(dashboardTitle).toContain('Dashboard');

      // Verify user is logged in
      const isLoggedIn = await dashboardPage.isUserLoggedIn();
      expect(isLoggedIn).toBe(true);

      // Verify URL contains dashboard
      const currentURL = await page.url();
      expect(currentURL).toContain('/dashboard');

      console.log('✅ Valid login test passed successfully');

    } catch (error) {
      await loginPage.takeScreenshot('valid-login-failure');
      throw error;
    }
  });

  test('AUTH-001.2: Should display correct dashboard elements after login', async ({ page }) => {
    // Login with valid credentials
    await loginPage.loginAsAdmin();

    // Verify dashboard content is loaded
    await dashboardPage.verifyDashboardContent();

    // Verify all main navigation elements are present
    const visibleMenuItems = await dashboardPage.getVisibleMenuItems();
    expect(visibleMenuItems.length).toBeGreaterThan(0);

    // Verify admin user has access to all modules
    await dashboardPage.verifyAdminAccess();

    console.log('✅ Dashboard elements verification passed');
  });

  test('AUTH-001.3: Should maintain session after successful login', async ({ page }) => {
    // Login with valid credentials
    await loginPage.loginAsAdmin();
    
    // Navigate to different modules and verify session is maintained
    await dashboardPage.navigateToPIM();
    await page.waitForLoadState('networkidle');
    
    // Verify user is still logged in
    const isLoggedIn = await dashboardPage.isUserLoggedIn();
    expect(isLoggedIn).toBe(true);

    // Navigate back to dashboard
    await page.goto('/web/index.php/dashboard/index');
    await dashboardPage.verifyDashboardLoaded();

    console.log('✅ Session maintenance test passed');
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Logout if user is logged in
    try {
      const isLoggedIn = await dashboardPage.isUserLoggedIn();
      if (isLoggedIn) {
        await dashboardPage.logout();
      }
    } catch (error) {
      console.log('Note: User may not be logged in, skipping logout');
    }
  });
}); 