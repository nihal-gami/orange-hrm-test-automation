import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { testUsers } from '../data/auth-test-data';

/**
 * Test Suite: Role-Based Access Control Tests
 * Jira Task: HRM-45 - AUTH-004: Implement Role-Based Access Control Test Automation
 * Epic: HRM-41 🔐 Authentication & Authorization
 */

test.describe('Role-Based Access Control Tests @auth', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Navigate to login page
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageLoaded();
  });

  test('AUTH-004.1: Should grant Admin user full system access', async ({ page }) => {
    const adminUser = testUsers.find(user => user.role === 'Admin');
    if (!adminUser) {
      throw new Error('Admin user not found in test data');
    }

    try {
      // Login as Admin user
      await loginPage.login(adminUser.username, adminUser.password);
      await dashboardPage.verifyDashboardLoaded();

      // Verify Admin has access to all expected modules
      await dashboardPage.verifyAdminAccess();

      // Get all visible menu items
      const visibleMenuItems = await dashboardPage.getVisibleMenuItems();
      
      // Verify all expected permissions are available
      for (const permission of adminUser.permissions) {
        const hasPermission = await dashboardPage.isMenuItemVisible(permission);
        expect(hasPermission).toBe(true);
        console.log(`✅ Admin access verified for module: ${permission}`);
      }

      console.log(`✅ Admin user has access to ${visibleMenuItems.length} modules as expected`);

    } catch (error) {
      await loginPage.takeScreenshot('admin-access-verification-failure');
      throw error;
    }
  });

  test('AUTH-004.2: Should allow Admin access to Admin module', async ({ page }) => {
    try {
      // Login as Admin
      await loginPage.loginAsAdmin();
      await dashboardPage.verifyDashboardLoaded();

      // Navigate to Admin module
      await dashboardPage.navigateToAdmin();
      
      // Verify successful navigation to Admin module
      await page.waitForLoadState('networkidle');
      const currentURL = await page.url();
      expect(currentURL).toContain('/admin');

      // Verify Admin module content is accessible
      const breadcrumb = await dashboardPage.getBreadcrumbText();
      expect(breadcrumb).toContain('Admin');

      console.log('✅ Admin user can access Admin module');

    } catch (error) {
      await loginPage.takeScreenshot('admin-module-access-failure');
      throw error;
    }
  });

  test('AUTH-004.3: Should allow Admin access to PIM module', async ({ page }) => {
    try {
      // Login as Admin
      await loginPage.loginAsAdmin();
      await dashboardPage.verifyDashboardLoaded();

      // Navigate to PIM module
      await dashboardPage.navigateToPIM();
      
      // Verify successful navigation to PIM module
      await page.waitForLoadState('networkidle');
      const currentURL = await page.url();
      expect(currentURL).toContain('/pim');

      console.log('✅ Admin user can access PIM module');

    } catch (error) {
      await loginPage.takeScreenshot('pim-module-access-failure');
      throw error;
    }
  });

  test('AUTH-004.4: Should allow Admin access to Leave module', async ({ page }) => {
    try {
      // Login as Admin
      await loginPage.loginAsAdmin();
      await dashboardPage.verifyDashboardLoaded();

      // Navigate to Leave module
      await dashboardPage.navigateToLeave();
      
      // Verify successful navigation to Leave module
      await page.waitForLoadState('networkidle');
      const currentURL = await page.url();
      expect(currentURL).toContain('/leave');

      console.log('✅ Admin user can access Leave module');

    } catch (error) {
      await loginPage.takeScreenshot('leave-module-access-failure');
      throw error;
    }
  });

  test('AUTH-004.5: Should allow Admin access to Time module', async ({ page }) => {
    try {
      // Login as Admin
      await loginPage.loginAsAdmin();
      await dashboardPage.verifyDashboardLoaded();

      // Navigate to Time module
      await dashboardPage.navigateToTime();
      
      // Verify successful navigation to Time module
      await page.waitForLoadState('networkidle');
      const currentURL = await page.url();
      expect(currentURL).toContain('/time');

      console.log('✅ Admin user can access Time module');

    } catch (error) {
      await loginPage.takeScreenshot('time-module-access-failure');
      throw error;
    }
  });

  test('AUTH-004.6: Should allow Admin access to Recruitment module', async ({ page }) => {
    try {
      // Login as Admin
      await loginPage.loginAsAdmin();
      await dashboardPage.verifyDashboardLoaded();

      // Navigate to Recruitment module
      await dashboardPage.navigateToRecruitment();
      
      // Verify successful navigation to Recruitment module
      await page.waitForLoadState('networkidle');
      const currentURL = await page.url();
      expect(currentURL).toContain('/recruitment');

      console.log('✅ Admin user can access Recruitment module');

    } catch (error) {
      await loginPage.takeScreenshot('recruitment-module-access-failure');
      throw error;
    }
  });

  test('AUTH-004.7: Should allow Admin access to Performance module', async ({ page }) => {
    try {
      // Login as Admin
      await loginPage.loginAsAdmin();
      await dashboardPage.verifyDashboardLoaded();

      // Navigate to Performance module
      await dashboardPage.navigateToPerformance();
      
      // Verify successful navigation to Performance module
      await page.waitForLoadState('networkidle');
      const currentURL = await page.url();
      expect(currentURL).toContain('/performance');

      console.log('✅ Admin user can access Performance module');

    } catch (error) {
      await loginPage.takeScreenshot('performance-module-access-failure');
      throw error;
    }
  });

  test('AUTH-004.8: Should validate navigation permissions consistency', async ({ page }) => {
    try {
      // Login as Admin
      await loginPage.loginAsAdmin();
      await dashboardPage.verifyDashboardLoaded();

      // Get initial list of visible modules
      const initialModules = await dashboardPage.getVisibleMenuItems();
      
      // Navigate to each module and verify access
      for (const module of ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'Performance']) {
        if (await dashboardPage.isMenuItemVisible(module)) {
          // Click on the module
          const moduleLink = page.locator(`text=${module}`).first();
          await moduleLink.click();
          await page.waitForLoadState('networkidle');
          
          // Verify navigation was successful (URL changed and no access denied message)
          const currentURL = await page.url();
          expect(currentURL).toContain(module.toLowerCase());
          
          // Check for any access denied or error messages
          const errorElement = page.locator('.oxd-alert-content');
          const hasError = await errorElement.isVisible();
          expect(hasError).toBe(false);
          
          console.log(`✅ Navigation to ${module} module successful`);
          
          // Navigate back to dashboard for next iteration
          await page.goto('/web/index.php/dashboard/index');
          await dashboardPage.verifyDashboardLoaded();
        }
      }

      console.log('✅ Navigation permissions consistency validated');

    } catch (error) {
      await loginPage.takeScreenshot('navigation-permissions-failure');
      throw error;
    }
  });

  test.afterEach(async ({ page }) => {
    // Logout after each test to ensure clean state
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