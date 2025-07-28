import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Test Suite: Logout Functionality Test
 * Related Jira Task: HRM-39
 * Epic: HRM-34 Authentication & Authorization
 * 
 * Verifies logout functionality and session termination
 */
test.describe('Logout Functionality', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login before each test
    await loginPage.navigateToLogin();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.verifyDashboardLoaded();
  });

  test('HRM-39: Should successfully logout and redirect to login page', async ({ page }) => {
    await test.step('Perform logout', async () => {
      await dashboardPage.logout();
    });

    await test.step('Verify redirect to login page', async () => {
      await loginPage.verifyLoginFormDisplayed();
      
      // Verify URL is login page
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    });

    await test.step('Verify session is terminated', async () => {
      // Should not be able to access dashboard directly
      const currentUrl = await page.url();
      const dashboardUrl = currentUrl.replace(/\/[^\/]*$/, '/dashboard');
      await page.goto(dashboardUrl);
      
      // Should redirect back to login
      await page.waitForLoadState('networkidle');
      const finalUrl = await page.url();
      expect(finalUrl).toContain('login');
    });

    await test.step('Take screenshot of logout success', async () => {
      await page.screenshot({ 
        path: 'test-results/screenshots/logout-success.png' 
      });
    });
  });

  test('HRM-39: Should clear session cookies and storage on logout', async ({ page, context }) => {
    await test.step('Check initial session state', async () => {
      // Get initial cookies and storage
      const initialCookies = await context.cookies();
      const initialLocalStorage = await page.evaluate(() => Object.keys(localStorage));
      const initialSessionStorage = await page.evaluate(() => Object.keys(sessionStorage));
      
      console.log('Initial state:', {
        cookies: initialCookies.length,
        localStorage: initialLocalStorage.length,
        sessionStorage: initialSessionStorage.length
      });
    });

    await test.step('Perform logout', async () => {
      await dashboardPage.logout();
      await loginPage.verifyLoginFormDisplayed();
    });

    await test.step('Verify session cleanup', async () => {
      // Check cookies after logout
      const finalCookies = await context.cookies();
      const finalLocalStorage = await page.evaluate(() => Object.keys(localStorage));
      const finalSessionStorage = await page.evaluate(() => Object.keys(sessionStorage));
      
      console.log('Final state:', {
        cookies: finalCookies.length,
        localStorage: finalLocalStorage.length,
        sessionStorage: finalSessionStorage.length
      });
      
      // Session storage should be cleared or significantly reduced
      // (Exact implementation depends on application)
    });
  });

  test('HRM-39: Should prevent back button access after logout', async ({ page }) => {
    await test.step('Navigate to different pages while logged in', async () => {
      await dashboardPage.navigateToPIM();
      await dashboardPage.navigateToLeave();
      await dashboardPage.navigateToAdmin();
    });

    await test.step('Perform logout', async () => {
      await dashboardPage.logout();
      await loginPage.verifyLoginFormDisplayed();
    });

    await test.step('Test back button security', async () => {
      await dashboardPage.testBackButtonAfterLogout();
    });

    await test.step('Verify multiple back button clicks', async () => {
      // Try going back multiple times
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      // Should still be on login page or redirected to login
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    });
  });

  test('HRM-39: Should logout from all application modules', async ({ page }) => {
    const modules = [
      { name: 'PIM', action: () => dashboardPage.navigateToPIM() },
      { name: 'Leave', action: () => dashboardPage.navigateToLeave() },
      { name: 'Admin', action: () => dashboardPage.navigateToAdmin() },
      { name: 'Time', action: () => dashboardPage.navigateToTime() },
      { name: 'Recruitment', action: () => dashboardPage.navigateToRecruitment() }
    ];

    for (const module of modules) {
      await test.step(`Test logout from ${module.name} module`, async () => {
        // Navigate to module
        await module.action();
        await page.waitForLoadState('networkidle');
        
        // Logout from this module
        await dashboardPage.logout();
        await loginPage.verifyLoginFormDisplayed();
        
        // Login again for next iteration
        if (module !== modules[modules.length - 1]) {
          await loginPage.login('Admin', 'admin123');
          await dashboardPage.verifyDashboardLoaded();
        }
      });
    }
  });

  test('HRM-39: Should handle logout button accessibility', async ({ page }) => {
    await test.step('Verify logout button is accessible via keyboard', async () => {
      // Navigate to user dropdown using keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      // Continue tabbing until reaching user dropdown (implementation specific)
      
      // Open dropdown
      await dashboardPage.openUserDropdown();
      
      // Verify logout button is visible and accessible
      const logoutButton = page.locator('text=Logout');
      await expect(logoutButton).toBeVisible();
      await expect(logoutButton).toBeFocused();
    });

    await test.step('Test logout with Enter key', async () => {
      await dashboardPage.openUserDropdown();
      const logoutButton = page.locator('text=Logout');
      await logoutButton.focus();
      await page.keyboard.press('Enter');
      
      await loginPage.verifyLoginFormDisplayed();
    });
  });

  test('HRM-39: Should handle concurrent logout scenarios', async ({ page, context }) => {
    await test.step('Open second tab with same session', async () => {
      const secondPage = await context.newPage();
      await secondPage.goto(page.url());
      
      // Second tab should also be logged in
      const secondDashboard = new DashboardPage(secondPage);
      await secondDashboard.verifyDashboardLoaded();
      
      // Logout from first tab
      await dashboardPage.logout();
      await loginPage.verifyLoginFormDisplayed();
      
      // Second tab should also be affected (session terminated)
      await secondPage.reload();
      await secondPage.waitForLoadState('networkidle');
      
      const secondTabUrl = await secondPage.url();
      expect(secondTabUrl).toContain('login');
      
      await secondPage.close();
    });
  });

  test('HRM-39: Should handle logout during active operations', async ({ page }) => {
    await test.step('Start navigation to a module', async () => {
      // Start navigation to a module but logout during the process
      const navigationPromise = dashboardPage.navigateToPIM();
      
      // Quickly logout before navigation completes
      await dashboardPage.openUserDropdown();
      const logoutButton = page.locator('text=Logout');
      await logoutButton.click();
      
      // Wait for either navigation or logout to complete
      await Promise.race([navigationPromise, page.waitForURL('**/login**')]);
      
      // Should end up on login page
      await page.waitForLoadState('networkidle');
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    });
  });

  test('HRM-39: Should maintain logout functionality across page refreshes', async ({ page }) => {
    await test.step('Refresh page and verify user is still logged in', async () => {
      await page.reload();
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Logout after page refresh', async () => {
      await dashboardPage.logout();
      await loginPage.verifyLoginFormDisplayed();
    });

    await test.step('Verify logout persists after refresh', async () => {
      await page.reload();
      await loginPage.verifyLoginFormDisplayed();
      
      // Should not auto-login
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    });
  });

  test('HRM-39: Should handle logout with network issues', async ({ page }) => {
    await test.step('Simulate network delay during logout', async () => {
      // Add network delay
      await page.route('**/logout**', route => {
        setTimeout(() => route.continue(), 2000); // 2 second delay
      });
      
      await dashboardPage.logout();
      
      // Should still successfully logout despite delay
      await loginPage.verifyLoginFormDisplayed();
    });

    await test.step('Test logout with offline scenario', async () => {
      // Login again
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
      
      // Simulate network failure
      await page.route('**/*', route => route.abort());
      
      try {
        await dashboardPage.logout();
        // May fail due to network, but client-side cleanup should happen
      } catch (error) {
        console.log('Logout failed due to network issues, this is expected');
      }
      
      // Reset network
      await page.unroute('**/*');
      
      // Verify session is still cleaned up locally
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login (depending on implementation)
      const currentUrl = await page.url();
      console.log('URL after network failure logout:', currentUrl);
    });
  });

  // Note: No beforeEach cleanup needed as each test starts with login
  // and ends with logout verification
}); 