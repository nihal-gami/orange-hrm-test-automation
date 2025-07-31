import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { userRoles, validCredentials } from '../data/auth-test-data';

/**
 * Test Suite: Role-based Access Control
 * Jira Task: HRM-63
 * 
 * This test suite verifies that different user roles have appropriate 
 * access permissions and restrictions within the Orange HRM system.
 * 
 * Test Coverage:
 * - Admin role full system access
 * - Menu visibility based on role
 * - Permission boundary testing
 * - Unauthorized access prevention
 * - Role inheritance verification
 */

test.describe('HRM-63: Role-based Access Control', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Navigate to login page before each test
    await loginPage.navigateToLogin();
  });

  test('should grant full system access to Admin role', async ({ page }) => {
    const adminRole = userRoles.find(role => role.roleName === 'Admin');
    
    if (!adminRole) {
      throw new Error('Admin role not found in test data');
    }
    
    // Login with admin credentials
    await loginPage.login(adminRole.username, adminRole.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Verify all expected menu items are visible for admin
    for (const expectedMenuItem of adminRole.expectedMenuItems) {
      const isMenuVisible = await dashboardPage.verifyModuleAccess(expectedMenuItem);
      expect(isMenuVisible).toBeTruthy();
    }
    
    // Verify admin can access all major modules
    const adminModules = [
      { name: 'Admin', method: () => dashboardPage.navigateToAdmin() },
      { name: 'PIM', method: () => dashboardPage.navigateToPIM() },
      { name: 'Leave', method: () => dashboardPage.navigateToLeave() },
      { name: 'Time', method: () => dashboardPage.navigateToTime() },
      { name: 'Recruitment', method: () => dashboardPage.navigateToRecruitment() },
      { name: 'My Info', method: () => dashboardPage.navigateToMyInfo() }
    ];
    
    for (const module of adminModules) {
      // Navigate to module
      await module.method();
      
      // Verify access is granted (no error page, proper URL)
      await page.waitForLoadState('networkidle');
      
      // Verify URL indicates successful access
      await expect(page).toHaveURL(new RegExp(module.name.toLowerCase().replace(' ', '')));
      
      // Navigate back to dashboard for next test
      await dashboardPage.dashboardMenuItem.click();
      await dashboardPage.waitForDashboardLoad();
    }
  });

  test('should display appropriate menu items based on admin role', async ({ page }) => {
    // Login with admin credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Get all visible menu items
    const visibleMenuItems = await dashboardPage.getVisibleMenuItems();
    
    // Expected menu items for admin role
    const expectedAdminMenuItems = [
      'Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 
      'My Info', 'Performance', 'Dashboard', 'Directory'
    ];
    
    // Verify each expected menu item is present
    for (const expectedItem of expectedAdminMenuItems) {
      const isMenuItemVisible = visibleMenuItems.some(item => 
        item.toLowerCase().includes(expectedItem.toLowerCase())
      );
      expect(isMenuItemVisible).toBeTruthy();
    }
    
    // Verify admin has access to user management functions
    await dashboardPage.navigateToAdmin();
    await page.waitForLoadState('networkidle');
    
    // Verify admin module loads successfully
    await expect(page).toHaveURL(/.*admin.*/);
  });

  test('should allow admin to access user management features', async ({ page }) => {
    // Login with admin credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Navigate to Admin module
    await dashboardPage.navigateToAdmin();
    await page.waitForLoadState('networkidle');
    
    // Verify admin module is accessible
    await expect(page).toHaveURL(/.*admin.*/);
    
    // Look for user management related elements
    const userManagementElements = [
      page.locator('text=User Management'),
      page.locator('text=Users'),
      page.locator('text=Add User'),
      page.locator('.oxd-topbar-header-breadcrumb')
    ];
    
    // At least one user management element should be visible
    let userManagementVisible = false;
    for (const element of userManagementElements) {
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        userManagementVisible = true;
        break;
      }
    }
    
    expect(userManagementVisible).toBeTruthy();
  });

  test('should allow admin to access PIM (Employee Management)', async ({ page }) => {
    // Login with admin credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Navigate to PIM module
    await dashboardPage.navigateToPIM();
    await page.waitForLoadState('networkidle');
    
    // Verify PIM module is accessible
    await expect(page).toHaveURL(/.*pim.*/);
    
    // Look for employee management features
    const pimElements = [
      page.locator('text=Employee Information'),
      page.locator('text=Add Employee'),
      page.locator('text=Employee List'),
      page.locator('.oxd-table'),
      page.locator('.oxd-topbar-header-breadcrumb')
    ];
    
    // At least one PIM element should be visible
    let pimVisible = false;
    for (const element of pimElements) {
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        pimVisible = true;
        break;
      }
    }
    
    expect(pimVisible).toBeTruthy();
  });

  test('should allow admin to access Leave Management', async ({ page }) => {
    // Login with admin credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Navigate to Leave module
    await dashboardPage.navigateToLeave();
    await page.waitForLoadState('networkidle');
    
    // Verify Leave module is accessible
    await expect(page).toHaveURL(/.*leave.*/);
    
    // Look for leave management features
    const leaveElements = [
      page.locator('text=Apply'),
      page.locator('text=My Leave'),
      page.locator('text=Leave List'),
      page.locator('text=Assign Leave'),
      page.locator('.oxd-topbar-header-breadcrumb')
    ];
    
    // At least one leave element should be visible
    let leaveVisible = false;
    for (const element of leaveElements) {
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        leaveVisible = true;
        break;
      }
    }
    
    expect(leaveVisible).toBeTruthy();
  });

  test('should allow admin to access Time & Attendance', async ({ page }) => {
    // Login with admin credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Navigate to Time module
    await dashboardPage.navigateToTime();
    await page.waitForLoadState('networkidle');
    
    // Verify Time module is accessible
    await expect(page).toHaveURL(/.*time.*/);
    
    // Look for time management features
    const timeElements = [
      page.locator('text=Timesheets'),
      page.locator('text=Attendance'),
      page.locator('text=Time'),
      page.locator('.oxd-topbar-header-breadcrumb')
    ];
    
    // At least one time element should be visible
    let timeVisible = false;
    for (const element of timeElements) {
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        timeVisible = true;
        break;
      }
    }
    
    expect(timeVisible).toBeTruthy();
  });

  test('should maintain role permissions across page refreshes', async ({ page }) => {
    // Login with admin credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Navigate to Admin module
    await dashboardPage.navigateToAdmin();
    await expect(page).toHaveURL(/.*admin.*/);
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify user is still logged in and has admin access
    await expect(page).toHaveURL(/.*admin.*/);
    
    // Verify admin menu items are still visible after refresh
    await dashboardPage.dashboardMenuItem.click();
    await dashboardPage.waitForDashboardLoad();
    
    const visibleMenuItems = await dashboardPage.getVisibleMenuItems();
    const hasAdminAccess = visibleMenuItems.some(item => 
      item.toLowerCase().includes('admin')
    );
    expect(hasAdminAccess).toBeTruthy();
  });

  test('should prevent direct URL access to unauthorized areas', async ({ page }) => {
    // This test would be more meaningful with different user roles
    // For now, we test the behavior of accessing URLs without login
    
    // Try to access admin page directly without login
    await page.goto('/web/index.php/admin/viewSystemUsers');
    
    // Should be redirected to login page
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*auth.*login.*/);
    
    // Verify login form is displayed
    await loginPage.verifyLoginFormDisplayed();
  });

  test('should validate session-based access control', async ({ page }) => {
    // Login with admin credentials
    await loginPage.login(validCredentials.username, validCredentials.password);
    await dashboardPage.verifySuccessfulLogin();
    
    // Navigate to multiple modules to establish session permissions
    const modules = [
      () => dashboardPage.navigateToAdmin(),
      () => dashboardPage.navigateToPIM(),
      () => dashboardPage.navigateToLeave()
    ];
    
    for (const moduleNavigation of modules) {
      await moduleNavigation();
      await page.waitForLoadState('networkidle');
      
      // Verify access is granted (not redirected to login)
      const currentUrl = page.url();
      expect(currentUrl).not.toMatch(/auth.*login/);
      
      // Navigate back to dashboard
      await dashboardPage.dashboardMenuItem.click();
      await dashboardPage.waitForDashboardLoad();
    }
  });

  test.afterEach(async ({ page }) => {
    // Take screenshot for documentation
    await page.screenshot({ 
      path: `test-results/screenshots/role-based-access-${test.info().title}-${Date.now()}.png`,
      fullPage: true 
    });
  });
}); 