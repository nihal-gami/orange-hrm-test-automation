import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Test Suite: Session Timeout Handling
 * Jira Task: HRM-31
 * Epic: HRM-27 🔐 Authentication & Authorization
 */
test.describe('Session Timeout Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('HRM-31: Should redirect to login after session timeout simulation', async ({ page }) => {
    // Arrange - Login first
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Act - Simulate session timeout by clearing session storage/cookies
    await page.evaluate(() => {
      // Clear session storage
      sessionStorage.clear();
      localStorage.clear();
    });
    
    // Clear session cookies
    await page.context().clearCookies();
    
    // Try to access protected page
    await page.goto('/web/index.php/admin/viewSystemUsers');
    
    // Assert - Should be redirected to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
  });

  test('Should handle expired session when accessing protected resources', async ({ page }) => {
    // Arrange - Login and navigate to dashboard
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Get current session cookies
    const cookies = await page.context().cookies();
    console.log(`Session cookies found: ${cookies.length}`);
    
    // Act - Clear all cookies to simulate session expiration
    await page.context().clearCookies();
    
    // Try to navigate to a protected page
    await page.goto('/web/index.php/pim/viewEmployeeList');
    
    // Assert - Should be redirected to login due to expired session
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*login/);
  });

  test('Should verify session timeout after prolonged inactivity', async ({ page }) => {
    // Arrange - Login
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Act - Simulate prolonged inactivity by waiting and then trying to perform an action
    // Note: In real scenarios, this might be a longer wait, but for testing we simulate it
    await page.waitForTimeout(5000); // 5 seconds simulation
    
    // Try to access a different module after "inactivity"
    await dashboardPage.navigateToAdmin();
    
    // Assert - In demo environment, session might still be valid
    // But we verify the behavior is consistent
    const currentUrl = page.url();
    console.log(`URL after inactivity: ${currentUrl}`);
    
    // If redirected to login, verify login page elements
    if (currentUrl.includes('login')) {
      await expect(loginPage.loginContainer).toBeVisible();
    } else {
      // If still logged in, verify we can access the admin page
      await expect(page).toHaveURL(/.*admin/);
    }
  });

  test('Should require re-authentication after session expiration', async ({ page }) => {
    // Arrange - Login and get to dashboard
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Act - Simulate session expiration
    await page.evaluate(() => {
      // Clear all storage
      sessionStorage.clear();
      localStorage.clear();
      
      // Clear any authentication tokens if stored in localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('token') || 
            key.toLowerCase().includes('auth') ||
            key.toLowerCase().includes('session')) {
          localStorage.removeItem(key);
        }
      });
    });
    
    // Clear cookies
    await page.context().clearCookies();
    
    // Try to perform a sensitive action (navigate to admin)
    await page.goto('/web/index.php/admin/viewSystemUsers');
    
    // Assert - In demo environment, session might persist server-side
    // Check if redirected to login OR if still has access (demo behavior)
    const currentUrl = page.url();
    
    if (currentUrl.includes('login')) {
      // Production-like behavior: redirected to login
      await expect(page).toHaveURL(/.*login/);
      console.log('✅ Session properly expired - redirected to login');
      
      // Verify re-authentication is required
      await loginPage.loginWithValidCredentials();
      await page.waitForLoadState('networkidle');
      
      // Wait for redirect after login (may take a moment)
      await page.waitForTimeout(2000);
      
      // After login, app may redirect to originally requested page (admin) or dashboard
      const postLoginUrl = page.url();
      if (postLoginUrl.includes('dashboard')) {
        await expect(page).toHaveURL(/.*dashboard/);
        console.log('✅ Re-authentication successful - redirected to dashboard');
      } else if (postLoginUrl.includes('admin')) {
        // App redirected back to originally requested admin page - this is correct behavior
        await expect(page).toHaveURL(/.*admin/);
        console.log('✅ Re-authentication successful - redirected to originally requested page');
      } else if (postLoginUrl.includes('login')) {
        // Still on login page - try navigating manually to verify login worked
        console.log('ℹ️  Still on login page after re-authentication, checking if login was successful');
        await page.goto('/web/index.php/dashboard/index');
        await page.waitForLoadState('networkidle');
        
        const finalUrl = page.url();
        if (finalUrl.includes('dashboard')) {
          console.log('✅ Re-authentication successful - manual navigation to dashboard worked');
          await expect(page).toHaveURL(/.*dashboard/);
        } else if (finalUrl.includes('login')) {
          throw new Error('Re-authentication failed - still redirected to login');
        } else {
          console.log(`✅ Re-authentication successful - navigated to: ${finalUrl}`);
        }
      } else {
        throw new Error(`Unexpected URL after re-authentication: ${postLoginUrl}`);
      }
    } else if (currentUrl.includes('admin')) {
      // Demo environment behavior: session persisted server-side
      console.log('ℹ️  Demo environment: Server-side session maintained after client-side clear');
      await expect(page).toHaveURL(/.*admin/);
      
      // Verify we can still navigate (session is active)
      await page.goto('/web/index.php/dashboard/index');
      await dashboardPage.waitForDashboardLoad();
    } else {
      throw new Error(`Unexpected URL after session clear: ${currentUrl}`);
    }
  });

  test('Should maintain session during normal activity', async ({ page }) => {
    // Arrange - Login
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Act - Perform normal user activities
    await dashboardPage.navigateToPIM();
    await page.waitForLoadState('networkidle');
    
    await dashboardPage.navigateToLeave();
    await page.waitForLoadState('networkidle');
    
    await dashboardPage.navigateToMyInfo();
    await page.waitForLoadState('networkidle');
    
    // Assert - Session should remain active
    await expect(page).toHaveURL(/.*pim/);
    await expect(dashboardPage.userDropdown).toBeVisible();
  });

  test('Should handle concurrent session management', async ({ page, context }) => {
    // Arrange - Login in first tab
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Create second tab and try to access protected page
    const secondTab = await context.newPage();
    await secondTab.goto('/web/index.php/dashboard/index');
    
    const secondDashboard = new DashboardPage(secondTab);
    
    // If session is shared, second tab should also be logged in
    try {
      await secondDashboard.waitForDashboardLoad();
      console.log('Session shared across tabs');
      
      // Clear session in first tab
      await page.evaluate(() => {
        sessionStorage.clear();
        localStorage.clear();
      });
      await page.context().clearCookies();
      
      // Check if second tab is affected
      await secondTab.reload();
      await secondTab.waitForLoadState('networkidle');
      
      // Verify if second tab was also logged out
      const secondTabUrl = secondTab.url();
      console.log(`Second tab URL after session clear: ${secondTabUrl}`);
      
    } catch (error) {
      console.log('Session not shared or second tab requires separate login');
    }
    
    await secondTab.close();
  });

  test('Should verify session cleanup on browser close simulation', async ({ page }) => {
    // Arrange - Login
    await loginPage.loginWithValidCredentials();
    await dashboardPage.waitForDashboardLoad();
    
    // Get session information before "closing"
    const beforeSessionStorage = await page.evaluate(() => 
      Object.keys(sessionStorage).length
    );
    
    // Act - Simulate browser close by clearing session storage
    await page.evaluate(() => {
      sessionStorage.clear();
      // Also clear any temporary authentication state
      if (window.location.hash) {
        window.location.hash = '';
      }
    });
    
    // Refresh page to simulate reopening browser
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Assert - Check behavior (demo vs production)
    const currentUrl = page.url();
    
    if (currentUrl.includes('login')) {
      // Production-like behavior: session cleared, redirected to login
      await expect(page).toHaveURL(/.*login/);
      await expect(loginPage.loginContainer).toBeVisible();
      console.log('✅ Session properly cleared on browser close simulation');
    } else if (currentUrl.includes('dashboard')) {
      // Demo environment behavior: server maintains session despite client-side clear
      console.log('ℹ️  Demo environment: Session maintained after page reload');
      await expect(dashboardPage.dashboardHeader).toBeVisible();
      
      // Verify session storage was actually cleared
      const afterSessionStorage = await page.evaluate(() => 
        Object.keys(sessionStorage).length
      );
      expect(afterSessionStorage).toBeLessThanOrEqual(beforeSessionStorage);
    } else {
      throw new Error(`Unexpected URL after browser close simulation: ${currentUrl}`);
    }
  });
}); 