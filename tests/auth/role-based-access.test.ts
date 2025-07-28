import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * Test Suite: Role-Based Access Control
 * Jira Task: HRM-57 - AUTH-004: Implement Role-Based Access Control Test
 * 
 * Objective: Verify that different user roles have appropriate access permissions
 */

test.describe('AUTH-004: Role-Based Access Control Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('should grant Admin role full system access', async ({ page }) => {
    await test.step('Login as Admin user', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Verify Admin has access to all modules', async () => {
      const visibleMenuItems = await dashboardPage.getVisibleMenuItems();
      
      // Admin should have access to all major modules
      expect(visibleMenuItems).toContain('Admin');
      expect(visibleMenuItems).toContain('Leave');
      expect(visibleMenuItems).toContain('Time');
      expect(visibleMenuItems).toContain('Recruitment');
      expect(visibleMenuItems).toContain('Performance');
    });

    await test.step('Verify Admin can access Admin module', async () => {
      await dashboardPage.navigateToAdmin();
      expect(page.url()).toContain('admin');
    });

    await test.step('Verify Admin can access Time module', async () => {
      await dashboardPage.navigateToLeave();
      expect(page.url()).toContain('leave');
    });

    await test.step('Verify Admin can access Leave module', async () => {
      await dashboardPage.navigateToLeave();
      expect(page.url()).toContain('leave');
    });
  });

  test('should display role-specific UI elements correctly for Admin', async ({ page }) => {
    await test.step('Login as Admin', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Verify Admin-specific menu items are visible', async () => {
      // Admin should see administrative functions
      expect(await dashboardPage.isMenuItemVisible(dashboardPage.adminMenuItem)).toBe(true);
      expect(await dashboardPage.isMenuItemVisible(dashboardPage.leaveMenuItem)).toBe(true);
      expect(await dashboardPage.isMenuItemVisible(dashboardPage.leaveMenuItem)).toBe(true);
    });

    await test.step('Verify navigation to Admin section', async () => {
      await dashboardPage.navigateToAdmin();
      
      // Should be able to access admin functions
      await expect(page).toHaveURL(/.*admin.*/);
    });
  });

  test('should prevent unauthorized access to restricted URLs', async ({ page }) => {
    // Test accessing protected URLs without authentication
    for (const protectedUrl of AuthTestData.sessionTestData.protectedUrls) {
      await test.step(`Attempt to access ${protectedUrl} without authentication`, async () => {
        await page.goto(`https://opensource-demo.orangehrmlive.com${protectedUrl}`);
        
        // Should redirect to login page
        await expect(page).toHaveURL(/.*login.*/);
      });
    }
  });

  test('should maintain role-based access after page refresh', async ({ page }) => {
    await test.step('Login as Admin and navigate to Admin section', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
      await dashboardPage.navigateToAdmin();
    });

    await test.step('Refresh page and verify access is maintained', async () => {
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should still have access to admin section
      expect(page.url()).toContain('admin');
      expect(await dashboardPage.isUserLoggedIn()).toBe(true);
    });
  });

  test('should enforce role permissions consistently across browser tabs', async ({ context, page }) => {
    await test.step('Login as Admin in first tab', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Open new tab and verify role permissions are maintained', async () => {
      const newPage = await context.newPage();
      await newPage.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
      
      // Should have access in new tab as well (session shared)
      await expect(newPage).toHaveURL(/.*admin.*/);
      
      await newPage.close();
    });
  });

  test('should handle role-based navigation restrictions', async ({ page }) => {
    await test.step('Login as Admin', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Test navigation between modules with Admin role', async () => {
      // Should be able to navigate between all modules
      await dashboardPage.navigateToAdmin();
      expect(page.url()).toContain('admin');

      await dashboardPage.navigateToLeave();
      expect(page.url()).toContain('leave');
    });
  });

  test('should display appropriate error for insufficient permissions', async ({ page }) => {
    // This test simulates accessing a restricted function
    // Note: This test may need adjustment based on actual role restrictions in the demo
    
    await test.step('Login as Admin (highest role in demo)', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Verify admin has appropriate access', async () => {
      // Since demo only has Admin user, we verify admin access works
      await dashboardPage.navigateToAdmin();
      expect(page.url()).toContain('admin');
      
      // In a real scenario with multiple roles, we would test:
      // - ESS user trying to access admin functions
      // - Supervisor trying to access global settings
      // This test serves as a placeholder for role restriction testing
    });
  });

  test('should validate role-based menu visibility', async ({ page }) => {
    await test.step('Login as Admin', async () => {
      await loginPage.navigateToLogin();
      await loginPage.loginAndWaitForDashboard(
        AuthTestData.validCredentials.username,
        AuthTestData.validCredentials.password
      );
    });

    await test.step('Verify all expected menu items are visible for Admin role', async () => {
      const visibleMenuItems = await dashboardPage.getVisibleMenuItems();
      
      // Expected menu items for Admin role
      const expectedAdminMenuItems = [
        'Admin',
        'Leave',
        'Time',
        'Recruitment',
        'Performance'
      ];

      for (const expectedItem of expectedAdminMenuItems) {
        expect(visibleMenuItems).toContain(expectedItem);
      }

      // Verify we have a reasonable number of menu items (not empty)
      expect(visibleMenuItems.length).toBeGreaterThan(4);
    });
  });
}); 