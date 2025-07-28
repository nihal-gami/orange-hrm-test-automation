import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * AUTH-001: Valid Login Test Automation
 * Jira Task: HRM-48
 * 
 * Test Objective: Verify that users can successfully login with valid credentials
 * and access the dashboard.
 */

test.describe('AUTH-001: Valid Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const { username, password } = AuthTestData.validCredentials;

    // Act
    await loginPage.login(username, password);

    // Assert
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyUserLoggedIn();
    await dashboardPage.verifyNavigationMenu();
    
    // Verify URL change to dashboard
    await page.waitForURL(/.*dashboard/);
    expect(page.url()).toContain('dashboard');
    
    // Verify dashboard elements
    await dashboardPage.verifyDashboardTitle();
    await dashboardPage.verifyDashboardWidgets();
  });

  test('should maintain session after login', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const { username, password } = AuthTestData.validCredentials;

    // Act - Login and navigate to different modules
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
    
    // Navigate to PIM module
    await dashboardPage.navigateToModule('PIM');
    await page.waitForURL(/.*pim/);
    
    // Navigate back to dashboard
    await dashboardPage.navigateToModule('Dashboard');

    // Assert - Session should be maintained
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyUserLoggedIn();
  });

  test('should display correct user information after login', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const { username, password } = AuthTestData.validCredentials;

    // Act
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();

    // Assert
    await dashboardPage.verifyUserLoggedIn();
    const currentUser = await dashboardPage.getCurrentUser();
    
    // Verify user information is displayed
    expect(currentUser).toBeTruthy();
    expect(currentUser.length).toBeGreaterThan(0);
  });

  test('should have proper page load performance', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const { username, password } = AuthTestData.validCredentials;

    // Act - Measure login time
    const startTime = Date.now();
    await loginPage.login(username, password);
    await dashboardPage.verifyDashboardLoaded();
    const endTime = Date.now();

    // Assert - Login should complete within reasonable time
    const loginDuration = endTime - startTime;
    expect(loginDuration).toBeLessThan(AuthTestData.timeouts.loginTimeout);
    
    console.log(`✅ Login completed in ${loginDuration}ms`);
  });
}); 