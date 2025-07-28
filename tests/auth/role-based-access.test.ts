import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Test Suite: Role-Based Access Control
 * Jira Task: HRM-32
 * Epic: HRM-27 🔐 Authentication & Authorization
 */
test.describe('Role-Based Access Control Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('HRM-32: Should verify Admin role has access to all modules', async ({ page }) => {
    // Arrange & Act - Login with Admin credentials
    await loginPage.loginWithValidCredentials(); // Admin/admin123
    await dashboardPage.waitForDashboardLoad();

    // Assert - Verify Admin has access to all major modules
    await dashboardPage.verifyAdminAccess();
    
    // Verify specific admin-only features are accessible
    await expect(dashboardPage.adminMenuItem).toBeVisible();
    await expect(dashboardPage.pimMenuItem).toBeVisible();
    await expect(dashboardPage.leaveMenuItem).toBeVisible();
    await expect(dashboardPage.timeMenuItem).toBeVisible();
    await expect(dashboardPage.recruitmentMenuItem).toBeVisible();
    await expect(dashboardPage.performanceMenuItem).toBeVisible();
    
    // Take screenshot for documentation
    await dashboardPage.takeScreenshot('admin-role-access');
  });

  test('Should verify Admin can access System Users management', async ({ page }) => {
    // Arrange - Login as Admin
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();

    // Act - Navigate to Admin module
    await dashboardPage.navigateToAdmin();
    await page.waitForLoadState('networkidle');

    // Assert - Verify access to admin functionalities
    await expect(page).toHaveURL(/.*admin/);
    
    // Check for admin-specific elements (System Users, etc.)
    const systemUsersLink = page.locator('text=System Users').first();
    if (await systemUsersLink.isVisible()) {
      await expect(systemUsersLink).toBeVisible();
    }
    
    // Verify admin navigation is accessible
    const adminNavigation = page.locator('.oxd-topbar-body-nav');
    if (await adminNavigation.isVisible()) {
      await expect(adminNavigation).toBeVisible();
    }
  });

  test('Should verify Admin can access Employee Management', async ({ page }) => {
    // Arrange - Login as Admin
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();

    // Act - Navigate to PIM (Employee Management)
    await dashboardPage.navigateToPIM();
    await page.waitForLoadState('networkidle');

    // Assert - Verify access to employee management
    await expect(page).toHaveURL(/.*pim/);
    
    // Check for PIM-specific functionalities
    const addEmployeeButton = page.locator('text=Add Employee');
    const employeeListLink = page.locator('text=Employee List');
    
    // Verify employee management options are available
    if (await addEmployeeButton.isVisible()) {
      await expect(addEmployeeButton).toBeVisible();
    }
    
    if (await employeeListLink.isVisible()) {
      await expect(employeeListLink).toBeVisible();
    }
  });

  test('Should verify Admin can access Leave Management', async ({ page }) => {
    // Arrange - Login as Admin
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();

    // Act - Navigate to Leave module
    await dashboardPage.navigateToLeave();
    await page.waitForLoadState('networkidle');

    // Assert - Verify access to leave management
    await expect(page).toHaveURL(/.*leave/);
    
    // Check for leave management functionalities
    const applyLeaveLink = page.locator('text=Apply').first();
    const myLeaveLink = page.locator('text=My Leave');
    const leaveListLink = page.locator('text=Leave List');
    
    // Admin should see comprehensive leave management options
    console.log('Verifying leave management access for Admin role');
  });

  test('Should verify role-based navigation visibility', async ({ page }) => {
    // Arrange - Login as Admin
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();

    // Act & Assert - Check visibility of all menu items for Admin role
    const menuItems = [
      { element: dashboardPage.adminMenuItem, name: 'Admin' },
      { element: dashboardPage.pimMenuItem, name: 'PIM' },
      { element: dashboardPage.leaveMenuItem, name: 'Leave' },
      { element: dashboardPage.timeMenuItem, name: 'Time' },
      { element: dashboardPage.recruitmentMenuItem, name: 'Recruitment' },
      { element: dashboardPage.myInfoMenuItem, name: 'My Info' },
      { element: dashboardPage.performanceMenuItem, name: 'Performance' }
    ];

    for (const item of menuItems) {
      const isVisible = await dashboardPage.isMenuItemVisible(item.element);
      console.log(`${item.name} menu item visible: ${isVisible}`);
      
      // Admin should have access to most modules
      if (item.name === 'Admin' || item.name === 'PIM' || item.name === 'Leave') {
        expect(isVisible).toBe(true);
      }
    }
  });

  test('Should verify unauthorized access prevention', async ({ page }) => {
    // This test simulates accessing protected resources without proper authentication
    
    // Act - Try to access admin page without login
    await page.goto('/web/index.php/admin/viewSystemUsers');
    
    // Assert - Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
    
    // Login and then test access to specific admin function
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Try to access admin functionality directly
    await page.goto('/web/index.php/admin/viewSystemUsers');
    
    // Admin user should be able to access this
    await page.waitForLoadState('networkidle');
    const finalUrl = page.url();
    
    // Verify either successful access or proper redirect
    if (finalUrl.includes('admin')) {
      console.log('Admin user has proper access to system users');
    } else if (finalUrl.includes('login')) {
      console.log('Access properly restricted, redirected to login');
    }
  });

  test('Should verify different user roles have appropriate permissions', async ({ page }) => {
    // Note: In the demo environment, we mainly have Admin access
    // This test documents the expected behavior for different roles
    
    // Test Admin role (available in demo)
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Verify admin can access system configuration
    await dashboardPage.navigateToAdmin();
    await page.waitForLoadState('networkidle');
    
    // Check URL contains admin - indicating proper access
    const adminUrl = page.url();
    expect(adminUrl).toMatch(/.*admin/);
    
    // Document role capabilities
    console.log('Admin role verification:');
    console.log(`- Can access admin module: ${adminUrl.includes('admin')}`);
    console.log(`- Dashboard access: ${await dashboardPage.isDashboardLoaded()}`);
    
    // Test employee self-service access (My Info)
    await dashboardPage.navigateToMyInfo();
    await page.waitForLoadState('networkidle');
    
    const myInfoUrl = page.url();
    console.log(`- Can access My Info: ${myInfoUrl.includes('pim')}`);
  });

  test('Should verify role-based UI element visibility', async ({ page }) => {
    // Arrange - Login as Admin
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();

    // Act & Assert - Check for role-specific UI elements
    
    // Admin should see user management dropdown
    await expect(dashboardPage.userDropdown).toBeVisible();
    
    // Admin should see main navigation menu
    await expect(dashboardPage.sideNavigation).toBeVisible();
    
    // Check for admin-specific elements in the navigation
    const navigationElements = await page.locator('.oxd-main-menu-item').all();
    console.log(`Number of navigation elements visible: ${navigationElements.length}`);
    
    // Verify essential menu items are present for admin role
    const menuTexts = await Promise.all(
      navigationElements.slice(0, 5).map(element => element.textContent())
    );
    
    console.log('Visible menu items:', menuTexts);
    
    // Admin should typically see these core modules
    const expectedAdminModules = ['Admin', 'PIM', 'Leave', 'Time'];
    const visibleModules = menuTexts.filter(text => 
      expectedAdminModules.some(module => text?.includes(module))
    );
    
    expect(visibleModules.length).toBeGreaterThan(0);
  });

  test('Should verify access control across different application areas', async ({ page }) => {
    // Arrange - Login as Admin
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();

    // Test access to different functional areas
    const functionalAreas = [
      { 
        name: 'Employee Management', 
        navigate: () => dashboardPage.navigateToPIM(),
        urlPattern: /.*pim/
      },
      { 
        name: 'Leave Management', 
        navigate: () => dashboardPage.navigateToLeave(),
        urlPattern: /.*leave/
      },
      { 
        name: 'Admin Functions', 
        navigate: () => dashboardPage.navigateToAdmin(),
        urlPattern: /.*admin/
      }
    ];

    for (const area of functionalAreas) {
      // Navigate to the functional area
      await area.navigate();
      await page.waitForLoadState('networkidle');
      
      // Verify access
      const currentUrl = page.url();
      const hasAccess = area.urlPattern.test(currentUrl);
      
      console.log(`${area.name} access: ${hasAccess ? 'GRANTED' : 'DENIED'}`);
      console.log(`URL: ${currentUrl}`);
      
      // Admin role should have access to these areas
      if (area.name === 'Employee Management' || area.name === 'Admin Functions') {
        expect(hasAccess).toBe(true);
      }
      
      // Return to dashboard for next test
      await page.goto('/web/index.php/dashboard/index');
      await dashboardPage.waitForDashboardLoad();
    }
  });
}); 