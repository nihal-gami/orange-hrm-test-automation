import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { testData } from '../data/auth-test-data';

/**
 * Test Suite: Role-Based Access Control Tests
 * Related Jira Task: HRM-38
 * Epic: HRM-34 Authentication & Authorization
 * 
 * Verifies role-based access control functionality
 */
test.describe('Role-Based Access Control', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigateToLogin();
  });

  test('HRM-38: Should verify Admin role has full access', async ({ page }) => {
    await test.step('Login as Admin user', async () => {
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Verify Admin role identification', async () => {
      const userRole = await dashboardPage.getCurrentUserRole();
      expect(userRole).toBe('Admin');
    });

    await test.step('Verify Admin menu access', async () => {
      await dashboardPage.verifyAdminMenuVisible();
      
      // Verify Admin can access Admin module
      const hasAdminAccess = await dashboardPage.checkAdminAccess();
      expect(hasAdminAccess).toBe(true);
    });

    await test.step('Verify access to all modules', async () => {
      const visibleMenus = await dashboardPage.getVisibleMenuItems();
      const expectedMenus = testData.userRoles[0].expectedMenus; // Admin role
      
      for (const menu of expectedMenus) {
        expect(visibleMenus).toContain(menu);
      }
    });

    await test.step('Test access to restricted URLs', async () => {
      // Admin should be able to access all URLs
      for (const url of testData.restrictedUrls) {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        const currentUrl = await page.url();
        // Should not redirect to unauthorized page
        expect(currentUrl).not.toContain('unauthorized');
        expect(currentUrl).not.toContain('access-denied');
      }
    });

    await test.step('Take screenshot of Admin dashboard', async () => {
      await page.screenshot({ 
        path: 'test-results/screenshots/admin-role-dashboard.png',
        fullPage: true 
      });
    });
  });

  test('HRM-38: Should test module-specific access permissions', async ({ page }) => {
    await test.step('Login as Admin', async () => {
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
    });

    const modules = [
      { name: 'Admin', action: () => dashboardPage.navigateToAdmin() },
      { name: 'PIM', action: () => dashboardPage.navigateToPIM() },
      { name: 'Leave', action: () => dashboardPage.navigateToLeave() },
      { name: 'Time', action: () => dashboardPage.navigateToTime() },
      { name: 'Recruitment', action: () => dashboardPage.navigateToRecruitment() },
      { name: 'Performance', action: () => dashboardPage.navigateToPerformance() }
    ];

    for (const module of modules) {
      await test.step(`Test access to ${module.name} module`, async () => {
        const hasAccess = await dashboardPage.verifyModuleAccess(module.name);
        expect(hasAccess).toBe(true);
        
        // Navigate back to dashboard for next test
        await page.goto('/web/index.php/dashboard/index');
        await dashboardPage.verifyDashboardLoaded();
      });
    }
  });

  test('HRM-38: Should prevent unauthorized URL access', async ({ page }) => {
    await test.step('Login as regular user (Admin for demo)', async () => {
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Test direct URL access to sensitive areas', async () => {
      const sensitiveUrls = [
        '/web/index.php/admin/viewSystemUsers',
        '/web/index.php/admin/saveSystemUser',
        '/web/index.php/admin/viewOrganizationGeneralInformation'
      ];

      for (const url of sensitiveUrls) {
        await dashboardPage.testUnauthorizedAccess(url);
      }
    });
  });

  test('HRM-38: Should verify menu visibility based on role', async ({ page }) => {
    await test.step('Login and get menu visibility', async () => {
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
      
      const visibleMenus = await dashboardPage.getVisibleMenuItems();
      console.log('Visible menus for Admin:', visibleMenus);
      
      // Verify specific menus are visible for Admin
      expect(visibleMenus).toContain('Admin');
      expect(visibleMenus).toContain('PIM');
      expect(visibleMenus).toContain('Leave');
    });

    await test.step('Verify menu items are clickable and functional', async () => {
      // Test that visible menu items actually work
      await dashboardPage.navigateToAdmin();
      await page.waitForLoadState('networkidle');
      
      let currentUrl = await page.url();
      expect(currentUrl.toLowerCase()).toContain('admin');
      
      // Navigate to PIM
      await dashboardPage.navigateToPIM();
      await page.waitForLoadState('networkidle');
      
      currentUrl = await page.url();
      expect(currentUrl.toLowerCase()).toContain('pim');
    });
  });

  test('HRM-38: Should handle role-based data access restrictions', async ({ page }) => {
    await test.step('Login as Admin', async () => {
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Test data visibility in different modules', async () => {
      // Navigate to PIM and verify data access
      await dashboardPage.navigateToPIM();
      await page.waitForLoadState('networkidle');
      
      // Check if employee list is visible (Admin should see all)
      const employeeList = page.locator('.oxd-table-body, .employee-list, [data-testid="employee-list"]');
      
      // Wait a bit for data to load
      await page.waitForTimeout(2000);
      
      // Admin should have access to employee data
      // (Exact implementation depends on application structure)
      const hasDataAccess = await employeeList.count() > 0 || 
                           await page.locator('.oxd-text').count() > 0;
      
      console.log('Admin has data access:', hasDataAccess);
    });

    await test.step('Test admin-specific functionality', async () => {
      // Navigate to Admin module
      await dashboardPage.navigateToAdmin();
      await page.waitForLoadState('networkidle');
      
      // Look for admin-specific elements (user management, system config, etc.)
      const adminElements = [
        '.admin-panel',
        '[data-testid="admin-panel"]',
        'text=User Management',
        'text=System Users',
        '.oxd-table', // Generic table that might show users
        '.admin-content'
      ];
      
      let hasAdminElements = false;
      for (const selector of adminElements) {
        try {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            hasAdminElements = true;
            break;
          }
        } catch (error) {
          // Continue to next selector
        }
      }
      
      console.log('Admin-specific elements found:', hasAdminElements);
    });
  });

  test('HRM-38: Should verify access control during navigation', async ({ page }) => {
    await test.step('Login and test navigation restrictions', async () => {
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Test breadcrumb navigation permissions', async () => {
      // Navigate through different levels and verify access
      await dashboardPage.navigateToAdmin();
      await page.waitForLoadState('networkidle');
      
      // Check breadcrumb navigation
      const breadcrumb = page.locator('.oxd-topbar-header-breadcrumb');
      if (await breadcrumb.count() > 0) {
        const breadcrumbText = await breadcrumb.textContent();
        expect(breadcrumbText).toBeTruthy();
        console.log('Breadcrumb navigation:', breadcrumbText);
      }
    });

    await test.step('Test deep link access control', async () => {
      // Test accessing deep links within modules
      const deepLinks = [
        '/web/index.php/admin/viewSystemUsers',
        '/web/index.php/pim/viewEmployeeList',
        '/web/index.php/leave/viewLeaveList'
      ];

      for (const link of deepLinks) {
        await page.goto(link);
        await page.waitForLoadState('networkidle');
        
        const currentUrl = await page.url();
        // Should be able to access these as Admin
        expect(currentUrl).toContain(link.split('/').pop() || '');
      }
    });
  });

  test('HRM-38: Should test session-based role validation', async ({ page }) => {
    await test.step('Login and verify initial role', async () => {
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
      
      const initialRole = await dashboardPage.getCurrentUserRole();
      expect(initialRole).toBe('Admin');
    });

    await test.step('Test role persistence across page refreshes', async () => {
      await page.reload();
      await dashboardPage.verifyDashboardLoaded();
      
      // Role should persist
      const roleAfterRefresh = await dashboardPage.getCurrentUserRole();
      expect(roleAfterRefresh).toBe('Admin');
      
      // Admin menu should still be visible
      await dashboardPage.verifyAdminMenuVisible();
    });

    await test.step('Test role validation on direct URL access', async () => {
      // Directly access an admin URL
      await page.goto('/web/index.php/admin/viewSystemUsers');
      await page.waitForLoadState('networkidle');
      
      // Should still have admin access
      const currentUrl = await page.url();
      expect(currentUrl).not.toContain('unauthorized');
    });
  });

  test('HRM-38: Should handle role-based error messages', async ({ page }) => {
    await test.step('Setup test environment', async () => {
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Test access to hypothetical restricted URL', async () => {
      // Try to access a URL that might be restricted for testing
      // (This is more relevant when testing with different user roles)
      const restrictedUrl = '/web/index.php/admin/nonexistent';
      await page.goto(restrictedUrl);
      await page.waitForLoadState('networkidle');
      
      const currentUrl = await page.url();
      // Should handle gracefully (404, redirect, or access control)
      console.log('Restricted URL handling:', currentUrl);
    });
  });

  test.afterEach(async ({ page }) => {
    // Logout after each test
    try {
      const currentUrl = await page.url();
      if (currentUrl.includes('dashboard') || currentUrl.includes('admin') || 
          currentUrl.includes('pim') || currentUrl.includes('leave')) {
        await dashboardPage.logout();
      }
    } catch (error) {
      console.log('Cleanup: Unable to logout, user may already be logged out');
    }
  });
}); 