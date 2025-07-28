import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Test Suite: Logout Functionality
 * Jira Task: HRM-33
 * Epic: HRM-27 🔐 Authentication & Authorization
 */
test.describe('Logout Functionality Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/web/index.php/auth/login');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
  });

  test('HRM-33: Should successfully logout and redirect to login page', async ({ page }) => {
    // Act
    await dashboardPage.logout();

    // Assert
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    
    // Take screenshot for documentation
    await loginPage.takeScreenshot('logout-success');
  });

  test('Should verify session is properly terminated after logout', async ({ page }) => {
    // Act
    await dashboardPage.logout();
    
    // Assert - Try to access protected page directly
    await page.goto('/web/index.php/dashboard/index');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
  });

  test('Should verify back button does not return to logged-in state', async ({ page }) => {
    // Arrange
    const dashboardUrl = page.url();
    
    // Act
    await dashboardPage.logout();
    await expect(page).toHaveURL(/.*login/);
    
    // Try to go back using browser back button
    await page.goBack();
    
    // Assert - Should not return to dashboard, should redirect to login
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
  });

  test('Should verify logout from different pages in application', async ({ page }) => {
    // Test logout from PIM page
    await dashboardPage.navigateToPIM();
    await page.waitForLoadState('networkidle');
    
    // Verify we're on PIM page
    await expect(page).toHaveURL(/.*pim/);
    
    // Logout from PIM page
    await dashboardPage.logout();
    
    // Assert
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
  });

  test('Should verify logout from Admin page', async ({ page }) => {
    // Navigate to Admin page
    await dashboardPage.navigateToAdmin();
    await page.waitForLoadState('networkidle');
    
    // Verify we're on Admin page
    await expect(page).toHaveURL(/.*admin/);
    
    // Logout from Admin page
    await dashboardPage.logout();
    
    // Assert
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
  });

  test('Should verify user dropdown opens before logout', async ({ page }) => {
    // Act
    await dashboardPage.clickUserDropdown();
    
    // Assert logout option is visible
    await expect(dashboardPage.logoutOption).toBeVisible();
    
    // Complete logout
    await dashboardPage.logoutOption.click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('Should verify no sensitive data cached after logout', async ({ page }) => {
    // Arrange - Navigate to a page with user info
    await dashboardPage.navigateToMyInfo();
    await page.waitForLoadState('networkidle');
    
    // Act
    await dashboardPage.logout();
    
    // Assert - Try to access the previous page directly
    await page.goto('/web/index.php/pim/viewMyDetails');
    
    // Should be redirected to login, not show cached data
    await expect(page).toHaveURL(/.*login/);
  });

  test('Should handle logout with multiple browser tabs', async ({ page, context }) => {
    // Create a new tab with the same session
    const newTab = await context.newPage();
    await newTab.goto('/web/index.php/dashboard/index');
    
    // Verify both tabs are logged in
    const newDashboard = new DashboardPage(newTab);
    await newDashboard.waitForDashboardLoad();
    
    // Logout from original tab
    await dashboardPage.logout();
    
    // Check if new tab is also logged out (session invalidation)
    await newTab.reload();
    await newTab.waitForLoadState('networkidle');
    
    // Should be redirected to login in the new tab too
    await expect(newTab).toHaveURL(/.*login/);
    
    await newTab.close();
  });

  test('Should verify logout option is always accessible', async ({ page }) => {
    // Test that logout option is available from dashboard
    await expect(dashboardPage.userDropdown).toBeVisible();
    
    // Click to open dropdown
    await dashboardPage.clickUserDropdown();
    await expect(dashboardPage.logoutOption).toBeVisible();
    
    // Verify logout option is clickable
    await expect(dashboardPage.logoutOption).toBeEnabled();
  });
}); 