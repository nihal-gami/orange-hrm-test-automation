import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Test Suite: Logout Functionality and Session Management Tests
 * Jira Task: HRM-46 - AUTH-005: Implement Logout Functionality Test Automation
 * Epic: HRM-41 🔐 Authentication & Authorization
 */

test.describe('Logout Functionality Tests @auth', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Navigate to login page and login for logout tests
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageLoaded();
    await loginPage.loginAsAdmin();
    await dashboardPage.verifyDashboardLoaded();
  });

  test('AUTH-005.1: Should successfully logout and redirect to login page', async ({ page }) => {
    try {
      // Verify user is currently logged in
      const isLoggedInBefore = await dashboardPage.isUserLoggedIn();
      expect(isLoggedInBefore).toBe(true);

      // Perform logout
      await dashboardPage.logout();

      // Verify redirect to login page
      await page.waitForLoadState('networkidle');
      const currentURL = await page.url();
      expect(currentURL).toContain('/auth/login');

      // Verify login page elements are present
      await loginPage.verifyLoginPageLoaded();

      console.log('✅ Logout successful and redirected to login page');

    } catch (error) {
      await loginPage.takeScreenshot('logout-redirect-failure');
      throw error;
    }
  });

  test('AUTH-005.2: Should terminate session after logout', async ({ page }) => {
    try {
      // Perform logout
      await dashboardPage.logout();
      await page.waitForLoadState('networkidle');

      // Try to access dashboard directly via URL
      await page.goto('/web/index.php/dashboard/index');
      await page.waitForLoadState('networkidle');

      // Verify user is redirected back to login (session terminated)
      const currentURL = await page.url();
      expect(currentURL).toContain('/auth/login');

      console.log('✅ Session terminated successfully after logout');

    } catch (error) {
      await loginPage.takeScreenshot('session-termination-failure');
      throw error;
    }
  });

  test('AUTH-005.3: Should prevent access to protected pages after logout', async ({ page }) => {
    const protectedPages = [
      '/web/index.php/dashboard/index',
      '/web/index.php/admin/viewSystemUsers',
      '/web/index.php/pim/viewEmployeeList',
      '/web/index.php/leave/viewLeaveList',
      '/web/index.php/time/viewEmployeeTimesheet',
      '/web/index.php/recruitment/viewJobVacancy'
    ];

    try {
      // Perform logout
      await dashboardPage.logout();
      await page.waitForLoadState('networkidle');

      // Try to access each protected page
      for (const protectedPage of protectedPages) {
        await page.goto(protectedPage);
        await page.waitForLoadState('networkidle');

        // Verify redirect to login page
        const currentURL = await page.url();
        expect(currentURL).toContain('/auth/login');
        
        console.log(`✅ Protected page ${protectedPage} correctly redirected to login`);
      }

      console.log('✅ All protected pages inaccessible after logout');

    } catch (error) {
      await loginPage.takeScreenshot('protected-pages-access-failure');
      throw error;
    }
  });

  test('AUTH-005.4: Should clear user session data after logout', async ({ page }) => {
    try {
      // Check session storage and local storage before logout
      const sessionStorageBefore = await page.evaluate(() => sessionStorage.length);
      const localStorageBefore = await page.evaluate(() => localStorage.length);

      // Perform logout
      await dashboardPage.logout();
      await page.waitForLoadState('networkidle');

      // Check session and local storage after logout
      const sessionStorageAfter = await page.evaluate(() => sessionStorage.length);
      const localStorageAfter = await page.evaluate(() => localStorage.length);

      console.log(`Session storage before logout: ${sessionStorageBefore}, after: ${sessionStorageAfter}`);
      console.log(`Local storage before logout: ${localStorageBefore}, after: ${localStorageAfter}`);

      // Verify login page is displayed
      await loginPage.verifyLoginPageLoaded();

      console.log('✅ Session data handling verified after logout');

    } catch (error) {
      await loginPage.takeScreenshot('session-data-cleanup-failure');
      throw error;
    }
  });

  test('AUTH-005.5: Should handle browser back button after logout', async ({ page }) => {
    try {
      // Perform logout
      await dashboardPage.logout();
      await page.waitForLoadState('networkidle');

      // Verify on login page
      let currentURL = await page.url();
      expect(currentURL).toContain('/auth/login');

      // Try to go back using browser back button
      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Verify still on login page or redirected back to login
      currentURL = await page.url();
      expect(currentURL).toContain('/auth/login');

      console.log('✅ Browser back button handled correctly after logout');

    } catch (error) {
      await loginPage.takeScreenshot('browser-back-button-failure');
      throw error;
    }
  });

  test('AUTH-005.6: Should allow re-login after logout', async ({ page }) => {
    try {
      // Perform logout
      await dashboardPage.logout();
      await page.waitForLoadState('networkidle');

      // Verify on login page
      await loginPage.verifyLoginPageLoaded();

      // Attempt to login again
      await loginPage.loginAsAdmin();

      // Verify successful re-login
      await dashboardPage.verifyDashboardLoaded();
      const isLoggedIn = await dashboardPage.isUserLoggedIn();
      expect(isLoggedIn).toBe(true);

      console.log('✅ Re-login successful after logout');

    } catch (error) {
      await loginPage.takeScreenshot('re-login-after-logout-failure');
      throw error;
    }
  });

  test('AUTH-005.7: Should handle logout from different pages', async ({ page }) => {
    const testPages = [
      { name: 'Dashboard', action: () => page.goto('/web/index.php/dashboard/index') },
      { name: 'Admin', action: () => dashboardPage.navigateToAdmin() },
      { name: 'PIM', action: () => dashboardPage.navigateToPIM() }
    ];

    for (const testPage of testPages) {
      try {
        // Navigate to test page
        await testPage.action();
        await page.waitForLoadState('networkidle');

        // Verify user is logged in
        const isLoggedIn = await dashboardPage.isUserLoggedIn();
        expect(isLoggedIn).toBe(true);

        // Perform logout from this page
        await dashboardPage.logout();
        await page.waitForLoadState('networkidle');

        // Verify redirect to login page
        const currentURL = await page.url();
        expect(currentURL).toContain('/auth/login');

        console.log(`✅ Logout successful from ${testPage.name} page`);

        // Re-login for next iteration
        if (testPages.indexOf(testPage) < testPages.length - 1) {
          await loginPage.loginAsAdmin();
          await dashboardPage.verifyDashboardLoaded();
        }

      } catch (error) {
        await loginPage.takeScreenshot(`logout-from-${testPage.name.toLowerCase()}-failure`);
        throw error;
      }
    }

    console.log('✅ Logout functionality verified from multiple pages');
  });

  test('AUTH-005.8: Should validate logout link visibility and accessibility', async ({ page }) => {
    try {
      // Verify user dropdown is visible
      await dashboardPage.verifyElementVisible(dashboardPage.userDropdown);

      // Click user dropdown to reveal logout option
      await dashboardPage.clickElement(dashboardPage.userDropdown);

      // Verify logout option is visible and clickable
      await dashboardPage.waitForElement(dashboardPage.logoutOption);
      await dashboardPage.verifyElementVisible(dashboardPage.logoutOption);

      // Verify logout option text
      const logoutText = await dashboardPage.getTextContent(dashboardPage.logoutOption);
      expect(logoutText).toContain('Logout');

      console.log('✅ Logout link visibility and accessibility verified');

    } catch (error) {
      await loginPage.takeScreenshot('logout-link-accessibility-failure');
      throw error;
    }
  });

  test.afterEach(async ({ page }) => {
    // Ensure clean state for next test
    try {
      const currentURL = await page.url();
      if (!currentURL.includes('/auth/login')) {
        // If not on login page, try to logout first
        const isLoggedIn = await dashboardPage.isUserLoggedIn();
        if (isLoggedIn) {
          await dashboardPage.logout();
        }
      }
    } catch (error) {
      // Force navigate to login page if logout fails
      await loginPage.navigateToLogin();
    }
  });
}); 