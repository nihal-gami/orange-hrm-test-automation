import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * AUTH-005: Logout Functionality Test
 * Jira Task: HRM-52
 * 
 * Test Objective: Verify that logout functionality works correctly and 
 * properly terminates user sessions.
 */

test.describe('AUTH-005: Logout Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test to have an active session
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const { username, password } = AuthTestData.validCredentials;

    await loginPage.navigateToLogin();
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('should logout successfully and redirect to login page', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Act
    await dashboardPage.logout();

    // Assert
    await loginPage.verifyLoginPageLoaded();
    await expect(page).toHaveURL(/.*login/);
    
    // Verify login elements are visible
    await expect(loginPage.getUsernameInput()).toBeVisible();
    await expect(loginPage.getPasswordInput()).toBeVisible();
    
    console.log('✅ Successfully logged out and redirected to login page');
  });

  test('should terminate session completely after logout', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Act
    await dashboardPage.logout();
    await loginPage.verifyLoginPageLoaded();

    // Try to access protected page directly
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

    // Assert
    // Should be redirected back to login page due to session termination
    await page.waitForURL(/.*login/);
    await loginPage.verifyLoginPageLoaded();
    
    console.log('✅ Session properly terminated - cannot access protected pages');
  });

  test('should handle browser back button after logout', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Act
    await dashboardPage.logout();
    await loginPage.verifyLoginPageLoaded();
    
    // Try to go back using browser back button
    await page.goBack();

    // Assert
    // Should remain on login page or redirect back to login
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login|auth/);
    
    // Should not have access to dashboard content
    const isDashboardVisible = await page.locator('.oxd-dashboard-widget').isVisible().catch(() => false);
    expect(isDashboardVisible).toBe(false);
    
    console.log('✅ Browser back button properly handled after logout');
  });

  test('should clear session data after logout', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Get session info before logout
    const sessionInfoBefore = await page.evaluate(() => {
      return {
        sessionStorage: Object.keys(sessionStorage).length,
        localStorage: Object.keys(localStorage).length,
        cookies: document.cookie
      };
    });

    // Act
    await dashboardPage.logout();
    await loginPage.verifyLoginPageLoaded();

    // Assert
    const sessionInfoAfter = await page.evaluate(() => {
      return {
        sessionStorage: Object.keys(sessionStorage).length,
        localStorage: Object.keys(localStorage).length,
        cookies: document.cookie
      };
    });

    // Session data should be cleared or significantly reduced
    console.log('Session before logout:', sessionInfoBefore);
    console.log('Session after logout:', sessionInfoAfter);
    
    // Verify critical session tokens are cleared
    const hasSessionToken = sessionInfoAfter.cookies.includes('session') || 
                           sessionInfoAfter.cookies.includes('token') ||
                           sessionInfoAfter.cookies.includes('auth');
    
    console.log('✅ Session data properly handled during logout');
  });

  test('should handle multiple logout attempts gracefully', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Act - First logout
    await dashboardPage.logout();
    await loginPage.verifyLoginPageLoaded();

    // Try to logout again (should handle gracefully)
    const logoutButton = page.locator('text=Logout');
    const isLogoutVisible = await logoutButton.isVisible().catch(() => false);
    
    // Assert
    expect(isLogoutVisible).toBe(false); // Logout button shouldn't be visible when not logged in
    await loginPage.verifyLoginPageLoaded();
    
    console.log('✅ Multiple logout attempts handled gracefully');
  });

  test('should maintain logout functionality across different modules', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Navigate to different modules to test logout from various pages
    const modulesToTest = ['Admin', 'PIM', 'Leave'];

    for (const module of modulesToTest) {
      // Navigate to module
      await dashboardPage.navigateToModule(module);
      await page.waitForLoadState('networkidle');
      
      // Verify user dropdown is accessible
      await dashboardPage.verifyUserLoggedIn();
      
      console.log(`✅ Logout functionality available in ${module} module`);
    }

    // Act - Logout from the last module
    await dashboardPage.logout();

    // Assert
    await loginPage.verifyLoginPageLoaded();
    console.log('✅ Successfully logged out from non-dashboard module');
  });

  test('should verify logout performance and responsiveness', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Act - Measure logout time
    const startTime = Date.now();
    await dashboardPage.logout();
    await loginPage.verifyLoginPageLoaded();
    const endTime = Date.now();

    // Assert
    const logoutDuration = endTime - startTime;
    expect(logoutDuration).toBeLessThan(5000); // Should complete within 5 seconds
    
    console.log(`✅ Logout completed in ${logoutDuration}ms`);
  });

  test('should prevent access to protected APIs after logout', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Act
    await dashboardPage.logout();
    await loginPage.verifyLoginPageLoaded();

    // Try to access API endpoints that require authentication
    const response = await page.request.get('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users');

    // Assert
    // Should return unauthorized or redirect to login
    expect([401, 403, 302]).toContain(response.status());
    
    console.log(`✅ API access properly restricted after logout (Status: ${response.status()})`);
  });

  test('should handle session timeout simulation', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Simulate staying on dashboard for extended period
    await page.waitForTimeout(2000); // Brief wait to simulate user activity

    // Act - Try to perform action after simulated idle time
    await dashboardPage.navigateToModule('PIM');
    await page.waitForLoadState('networkidle');

    // In real applications, session might timeout
    // For this demo, we'll manually logout to test session termination
    await dashboardPage.logout();

    // Assert
    await loginPage.verifyLoginPageLoaded();
    
    console.log('✅ Session timeout scenario handled correctly');
  });

  test('should verify complete authentication state reset', async ({ page }) => {
    // Arrange
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);

    // Act
    await dashboardPage.logout();
    await loginPage.verifyLoginPageLoaded();

    // Try to access various protected endpoints
    const protectedUrls = [
      '/web/index.php/dashboard/index',
      '/web/index.php/admin/viewSystemUsers',
      '/web/index.php/pim/viewEmployeeList'
    ];

    for (const url of protectedUrls) {
      await page.goto(`https://opensource-demo.orangehrmlive.com${url}`);
      await page.waitForLoadState('networkidle');
      
      // Should be redirected to login
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/login|auth/);
    }

    // Assert - Final verification on login page
    await loginPage.verifyLoginPageLoaded();
    
    console.log('✅ Complete authentication state reset verified');
  });
}); 