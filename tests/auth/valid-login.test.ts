import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * Test Suite: Valid Login Functionality
 * Jira Task: HRM-54 - AUTH-001: Implement Valid Login Test
 * 
 * Objective: Verify that users can successfully log in with valid credentials
 */

test.describe('AUTH-001: Valid Login Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigateToLogin();
  });

  test('should successfully login with valid Admin credentials', async ({ page }) => {
    // Test Description: Verify successful login with correct credentials
    await test.step('Enter valid credentials and login', async () => {
      await loginPage.login(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Verify successful navigation to dashboard', async () => {
      await expect(page).toHaveURL(/.*dashboard/);
      await dashboardPage.waitForDashboardLoad();
    });

    await test.step('Verify dashboard is displayed', async () => {
      expect(await dashboardPage.isDashboardVisible()).toBe(true);
      expect(await dashboardPage.getDashboardTitle()).toContain('Dashboard');
    });

    await test.step('Verify user session is established', async () => {
      expect(await dashboardPage.isUserLoggedIn()).toBe(true);
    });

    await test.step('Verify no error messages are shown', async () => {
      expect(await loginPage.isErrorMessageVisible()).toBe(false);
    });
  });

  test('should maintain session after page refresh', async ({ page }) => {
    // Login first
    await loginPage.loginAndWaitForDashboard(
      AuthTestData.validCredentials.username,
      AuthTestData.validCredentials.password
    );

    await test.step('Refresh the page', async () => {
      await page.reload();
      await dashboardPage.waitForDashboardLoad();
    });

    await test.step('Verify user remains logged in after refresh', async () => {
      expect(await dashboardPage.isUserLoggedIn()).toBe(true);
      expect(await dashboardPage.isDashboardVisible()).toBe(true);
    });
  });

  test('should display correct page title after login', async ({ page }) => {
    await loginPage.loginAndWaitForDashboard(
      AuthTestData.validCredentials.username,
      AuthTestData.validCredentials.password
    );

    await test.step('Verify page title is correct', async () => {
      const title = await dashboardPage.getPageTitle();
      expect(title).toContain('OrangeHRM');
    });
  });

  test('should have access to navigation menu after login', async ({ page }) => {
    await loginPage.loginAndWaitForDashboard(
      AuthTestData.validCredentials.username,
      AuthTestData.validCredentials.password
    );

    await test.step('Verify navigation menu is accessible', async () => {
      const visibleMenuItems = await dashboardPage.getVisibleMenuItems();
      expect(visibleMenuItems.length).toBeGreaterThan(0);
      expect(visibleMenuItems).toContain('Admin');
      expect(visibleMenuItems).toContain('Leave');
    });
  });
}); 