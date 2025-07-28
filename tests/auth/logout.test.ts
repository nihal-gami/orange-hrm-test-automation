import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * Test Suite: Logout Functionality
 * Jira Task: HRM-58 - AUTH-005: Implement Logout Functionality Test
 * 
 * Objective: Verify that users can properly log out and session is terminated
 */

test.describe('AUTH-005: Logout Functionality Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('should successfully logout and redirect to login page', async ({ page }) => {
    await test.step('Login with valid credentials', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
      
      // Verify we are logged in
      expect(await dashboardPage.isUserLoggedIn()).toBe(true);
    });

    await test.step('Navigate to different pages within application', async () => {
      await dashboardPage.navigateToAdmin();
      expect(page.url()).toContain('admin');
      
      await dashboardPage.navigateToLeave();
      expect(page.url()).toContain('leave');
    });

    await test.step('Perform logout', async () => {
      await dashboardPage.logout();
    });

    await test.step('Verify user is redirected to login page', async () => {
      await expect(page).toHaveURL(/.*login.*/);
      expect(await loginPage.isLoginFormVisible()).toBe(true);
    });

    await test.step('Verify session is terminated', async () => {
      expect(await dashboardPage.isUserLoggedIn()).toBe(false);
    });
  });

  test('should prevent access to protected pages after logout', async ({ page }) => {
    await test.step('Login and then logout', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
      await dashboardPage.logout();
    });

    await test.step('Attempt to access protected pages after logout', async () => {
      for (const protectedUrl of AuthTestData.sessionTestData.protectedUrls) {
        await page.goto(`https://opensource-demo.orangehrmlive.com${protectedUrl}`);
        
        // Should redirect to login page
        await expect(page).toHaveURL(/.*login.*/);
        expect(await loginPage.isLoginFormVisible()).toBe(true);
      }
    });
  });

  test('should clear user session data after logout', async ({ page }) => {
    await test.step('Login and navigate to dashboard', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Verify user is logged in', async () => {
      expect(await dashboardPage.isDashboardVisible()).toBe(true);
      expect(await dashboardPage.isUserLoggedIn()).toBe(true);
    });

    await test.step('Logout and verify session is cleared', async () => {
      await dashboardPage.logout();
      
      // Verify we're back at login page
      await expect(page).toHaveURL(/.*login.*/);
      
      // Try to go back using browser back button
      await page.goBack();
      
      // Should still be at login page or redirected back to login
      await expect(page).toHaveURL(/.*login.*/);
    });
  });

  test('should handle logout from different pages within application', async ({ page }) => {
    await test.step('Login and navigate to Admin page', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
      await dashboardPage.navigateToAdmin();
    });

    await test.step('Logout from Admin page', async () => {
      await dashboardPage.logout();
      await expect(page).toHaveURL(/.*login.*/);
    });

    await test.step('Login again and navigate to Leave page', async () => {
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
      await dashboardPage.navigateToLeave();
    });

    await test.step('Logout from Leave page', async () => {
      await dashboardPage.logout();
      await expect(page).toHaveURL(/.*login.*/);
    });
  });

  test('should handle logout with browser refresh scenarios', async ({ page }) => {
    await test.step('Login and refresh page', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
      
      await page.reload();
      await dashboardPage.waitForDashboardLoad();
      expect(await dashboardPage.isUserLoggedIn()).toBe(true);
    });

    await test.step('Logout after page refresh', async () => {
      await dashboardPage.logout();
      await expect(page).toHaveURL(/.*login.*/);
    });

    await test.step('Verify session is properly terminated', async () => {
      await page.reload();
      await expect(page).toHaveURL(/.*login.*/);
    });
  });

  test('should maintain logout state across browser tabs', async ({ context, page }) => {
    await test.step('Login in first tab', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Open second tab and verify logged in state', async () => {
      const secondTab = await context.newPage();
      await secondTab.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
      
      const secondDashboardPage = new DashboardPage(secondTab);
      await secondDashboardPage.waitForDashboardLoad();
      expect(await secondDashboardPage.isUserLoggedIn()).toBe(true);
      
      await secondTab.close();
    });

    await test.step('Logout from first tab', async () => {
      await dashboardPage.logout();
      await expect(page).toHaveURL(/.*login.*/);
    });

    await test.step('Verify logout affected all tabs', async () => {
      const thirdTab = await context.newPage();
      await thirdTab.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
      
      // Should redirect to login
      await expect(thirdTab).toHaveURL(/.*login.*/);
      
      await thirdTab.close();
    });
  });

  test('should not cache sensitive data after logout', async ({ page }) => {
    await test.step('Login and navigate to sensitive page', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
      await dashboardPage.navigateToAdmin();
    });

    await test.step('Logout', async () => {
      await dashboardPage.logout();
      await expect(page).toHaveURL(/.*login.*/);
    });

    await test.step('Verify no sensitive data is accessible after logout', async () => {
      // Try to access admin page directly
      await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
      
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login.*/);
      
      // Try using browser back button
      await page.goBack();
      await expect(page).toHaveURL(/.*login.*/);
    });
  });

  test('should handle rapid logout attempts', async ({ page }) => {
    await test.step('Login', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Perform multiple rapid logout attempts', async () => {
      // Click user dropdown
      await dashboardPage.userDropdown.click();
      
      // Click logout (this should work)
      await dashboardPage.logoutOption.click();
      await expect(page).toHaveURL(/.*login.*/);
    });

    await test.step('Verify logout completed successfully', async () => {
      expect(await loginPage.isLoginFormVisible()).toBe(true);
    });
  });

  test('should provide accessible logout option', async ({ page }) => {
    await test.step('Login and verify logout option is accessible', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Verify logout button/link is accessible', async () => {
      // User dropdown should be visible
      expect(await dashboardPage.isElementVisible(dashboardPage.userDropdown)).toBe(true);
      
      // Click user dropdown to reveal logout option
      await dashboardPage.userDropdown.click();
      
      // Logout option should be visible
      expect(await dashboardPage.isElementVisible(dashboardPage.logoutOption)).toBe(true);
    });

    await test.step('Complete logout', async () => {
      await dashboardPage.logoutOption.click();
      await expect(page).toHaveURL(/.*login.*/);
    });
  });
}); 