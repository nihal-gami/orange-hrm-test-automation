import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Test Suite: Valid Login with Correct Credentials
 * Related Jira Task: HRM-35
 * Epic: HRM-34 Authentication & Authorization
 */
test.describe('Valid Login - Correct Credentials', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Navigate to login page
    await loginPage.navigateToLogin();
  });

  test('HRM-35: Should successfully login with valid credentials', async ({ page }) => {
    // Test Case: Valid login with Admin credentials
    await test.step('Enter valid credentials', async () => {
      await loginPage.login('Admin', 'admin123');
    });

    await test.step('Verify successful login and dashboard redirect', async () => {
      // Wait for dashboard to load
      await dashboardPage.verifyDashboardLoaded();
      
      // Verify URL redirection
      const currentUrl = await dashboardPage.getCurrentUrl();
      expect(currentUrl).toContain('dashboard');
      
      // Verify dashboard elements are visible
      await dashboardPage.verifyDashboardTitle();
      await dashboardPage.verifyMainMenuVisible();
    });

    await test.step('Verify user session is active', async () => {
      await dashboardPage.verifySessionActive();
    });

    await test.step('Take screenshot for verification', async () => {
      await page.screenshot({ 
        path: 'test-results/screenshots/valid-login-success.png',
        fullPage: true 
      });
    });
  });

  test('HRM-35: Should maintain session across page navigation', async ({ page }) => {
    // Login first
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.verifyDashboardLoaded();

    await test.step('Navigate to different modules and verify session persistence', async () => {
      // Navigate to PIM
      await dashboardPage.navigateToPIM();
      await dashboardPage.verifySessionActive();
      
      // Navigate to Leave
      await dashboardPage.navigateToLeave();
      await dashboardPage.verifySessionActive();
      
      // Navigate back to Dashboard
      await page.goto('/web/index.php/dashboard/index');
      await dashboardPage.verifyDashboardLoaded();
    });
  });

  test('HRM-35: Should display correct user information after login', async ({ page }) => {
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.verifyDashboardLoaded();

    await test.step('Verify Admin role access', async () => {
      // Admin user should have access to Admin menu
      await dashboardPage.verifyAdminMenuVisible();
      
      // Get user role
      const userRole = await dashboardPage.getCurrentUserRole();
      expect(userRole).toBe('Admin');
    });

    await test.step('Verify all menu items are accessible for Admin', async () => {
      const visibleMenus = await dashboardPage.getVisibleMenuItems();
      
      // Admin should see all major modules
      expect(visibleMenus).toContain('Admin');
      expect(visibleMenus).toContain('PIM');
      expect(visibleMenus).toContain('Leave');
      expect(visibleMenus).toContain('Time');
      expect(visibleMenus).toContain('Recruitment');
      expect(visibleMenus).toContain('Performance');
    });
  });

  test('HRM-35: Should handle slow network conditions gracefully', async ({ page, context }) => {
    // Simulate slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000); // 1 second delay
    });

    await test.step('Login with network delay', async () => {
      await loginPage.login('Admin', 'admin123');
      
      // Should still succeed despite slow network
      await dashboardPage.verifyDashboardLoaded();
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up: logout if logged in
    try {
      const currentUrl = await page.url();
      if (currentUrl.includes('dashboard')) {
        await dashboardPage.logout();
        await loginPage.verifyLoginFormDisplayed();
      }
    } catch (error) {
      console.log('Cleanup: User was not logged in or already logged out');
    }
  });
}); 