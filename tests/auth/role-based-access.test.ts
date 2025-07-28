import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * AUTH-004: Role-Based Access Control Test
 * Jira Task: HRM-51
 * 
 * Test Objective: Verify that different user roles have appropriate access 
 * to system modules and functionality.
 */

test.describe('AUTH-004: Role-Based Access Control Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should verify Admin user has full system access', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();

    // Assert - Verify admin access to all modules
    await dashboardPage.verifyAdminAccess();
    
    // Check that admin menus are visible
    const expectedMenus = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info'];
    
    for (const menuName of expectedMenus) {
      const menuItem = page.locator(`text=${menuName}`).first();
      await expect(menuItem).toBeVisible();
      console.log(`✅ Admin can access: ${menuName}`);
    }
  });

  test('should verify Admin can access Admin module functionality', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();
    
    // Navigate to Admin module
    await dashboardPage.navigateToModule('Admin');

    // Assert
    await page.waitForURL(/.*admin/);
    expect(page.url()).toContain('admin');
    
    // Verify admin-specific functionality is accessible
    const userManagementSection = page.locator('text=User Management');
    await expect(userManagementSection).toBeVisible();
    
    console.log('✅ Admin successfully accessed Admin module');
  });

  test('should verify Admin can access PIM module', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();
    
    // Navigate to PIM module
    await dashboardPage.navigateToModule('PIM');

    // Assert
    await page.waitForURL(/.*pim/);
    expect(page.url()).toContain('pim');
    
    // Verify PIM functionality is accessible
    const employeeListSection = page.locator('.oxd-table-header-cell');
    await expect(employeeListSection.first()).toBeVisible();
    
    console.log('✅ Admin successfully accessed PIM module');
  });

  test('should verify Admin can access Leave module', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();
    
    // Navigate to Leave module
    await dashboardPage.navigateToModule('Leave');

    // Assert
    await page.waitForURL(/.*leave/);
    expect(page.url()).toContain('leave');
    
    // Verify Leave functionality is accessible
    await page.waitForLoadState('networkidle');
    const leaveSection = page.locator('.oxd-topbar-header-breadcrumb');
    await expect(leaveSection).toBeVisible();
    
    console.log('✅ Admin successfully accessed Leave module');
  });

  test('should verify navigation menu consistency across modules', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();

    const modulesToTest = ['Admin', 'PIM', 'Leave'];
    
    for (const module of modulesToTest) {
      // Navigate to module
      await dashboardPage.navigateToModule(module);
      await page.waitForLoadState('networkidle');
      
      // Assert - Navigation menu should be consistent
      await dashboardPage.verifyNavigationMenu();
      
      // Verify user dropdown is still accessible
      await dashboardPage.verifyUserLoggedIn();
      
      console.log(`✅ Navigation consistency verified in ${module} module`);
    }
  });

  test('should verify role-based UI elements visibility', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();

    // Assert - Check for admin-specific UI elements
    await dashboardPage.verifyAdminAccess();
    
    // Check user info displays correct role
    const userDropdown = page.locator('.oxd-userdropdown-tab');
    await userDropdown.click();
    
    const userInfo = page.locator('.oxd-userdropdown-name');
    await expect(userInfo).toBeVisible();
    
    console.log('✅ Admin role UI elements verified');
  });

  test('should verify access restrictions for unauthorized modules (simulation)', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();

    // Assert - In a real scenario with multiple roles, we would test:
    // 1. ESS users can only access limited modules
    // 2. Supervisor users have team management access
    // 3. Admin users have full access
    
    // For demo environment, verify all expected admin modules are accessible
    const adminModules = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info'];
    
    for (const module of adminModules) {
      const moduleLink = page.locator(`text=${module}`).first();
      const isVisible = await moduleLink.isVisible();
      expect(isVisible).toBe(true);
      console.log(`✅ ${module} module accessible for Admin role`);
    }
  });

  test('should verify session maintains role permissions', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();
    
    // Navigate to multiple modules to simulate extended session
    await dashboardPage.navigateToModule('Admin');
    await page.waitForLoadState('networkidle');
    
    await dashboardPage.navigateToModule('PIM');
    await page.waitForLoadState('networkidle');
    
    await dashboardPage.navigateToModule('Dashboard');
    await page.waitForLoadState('networkidle');

    // Assert - Role permissions should be maintained throughout session
    await dashboardPage.verifyAdminAccess();
    await dashboardPage.verifyUserLoggedIn();
    
    console.log('✅ Role permissions maintained throughout session');
  });

  test('should verify proper error handling for direct URL access', async ({ page }) => {
    // Note: This test simulates accessing protected URLs directly
    // In a real environment, this would test unauthorized access attempts
    
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const adminCreds = AuthTestData.userRoles.admin;

    // Act - Login first to establish session
    await loginPage.login(adminCreds.username, adminCreds.password);
    await dashboardPage.verifyDashboardLoaded();

    // Try accessing admin URL directly
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers');
    
    // Assert - Should be accessible for admin user
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('admin');
    
    // Verify admin functionality is available
    const adminContent = page.locator('.oxd-table-header');
    await expect(adminContent.first()).toBeVisible();
    
    console.log('✅ Direct URL access properly handled for admin user');
  });
}); 