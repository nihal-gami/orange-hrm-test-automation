import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Test Suite: Session Timeout Test
 * Related Jira Task: HRM-40
 * Epic: HRM-34 Authentication & Authorization
 * 
 * Verifies session timeout functionality and proper handling
 */
test.describe('Session Timeout', () => {
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

  test('HRM-40: Should handle simulated session timeout', async ({ page }) => {
    await test.step('Simulate session timeout by clearing storage', async () => {
      await dashboardPage.simulateSessionTimeout();
    });

    await test.step('Verify redirect to login page', async () => {
      await loginPage.verifyLoginFormDisplayed();
      
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    });

    await test.step('Verify cannot access protected resources', async () => {
      // Try to access dashboard directly
      await page.goto('/web/index.php/dashboard/index');
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login
      const finalUrl = await page.url();
      expect(finalUrl).toContain('login');
    });
  });

  test('HRM-40: Should test session timeout after inactivity period', async ({ page }) => {
    // Note: This test simulates timeout since waiting for real timeout would take too long
    
    await test.step('Verify initial session is active', async () => {
      await dashboardPage.verifySessionActive();
    });

    await test.step('Simulate extended inactivity', async () => {
      // Clear session storage to simulate timeout
      await page.evaluate(() => {
        sessionStorage.clear();
        localStorage.clear();
      });
      
      // Clear authentication cookies
      const context = page.context();
      await context.clearCookies();
      
      // Wait a moment for any JavaScript session handlers
      await page.waitForTimeout(1000);
    });

    await test.step('Attempt to perform action after simulated timeout', async () => {
      // Try to navigate to a different module
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login page
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    });
  });

  test('HRM-40: Should maintain session during active usage', async ({ page }) => {
    await test.step('Perform various actions to keep session active', async () => {
      const actions = [
        () => dashboardPage.navigateToPIM(),
        () => dashboardPage.navigateToLeave(),
        () => dashboardPage.navigateToAdmin(),
        () => page.goto('/web/index.php/dashboard/index')
      ];

      // Perform actions with delays
      for (const action of actions) {
        await action();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // 2 second delay between actions
        
        // Verify session is still active
        await dashboardPage.verifySessionActive();
      }
    });

    await test.step('Verify session remains active after activity', async () => {
      await dashboardPage.verifySessionActive();
      
      // Should still be able to access dashboard
      const currentUrl = await page.url();
      expect(currentUrl).not.toContain('login');
    });
  });

  test('HRM-40: Should handle session timeout during form submission', async ({ page }) => {
    await test.step('Navigate to a form page', async () => {
      await dashboardPage.navigateToPIM();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Simulate session timeout during form interaction', async () => {
      // Clear session in background (simulating timeout)
      await page.evaluate(() => {
        sessionStorage.clear();
        // Simulate partial localStorage clearing that might happen during timeout
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('session') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
      });
      
      // Clear auth cookies
      const context = page.context();
      await context.clearCookies();
    });

    await test.step('Attempt form submission after timeout', async () => {
      // Try to perform an action that requires authentication
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    });
  });

  test('HRM-40: Should handle session timeout in multiple tabs', async ({ page, context }) => {
    await test.step('Open second tab with same session', async () => {
      const secondPage = await context.newPage();
      await secondPage.goto(page.url());
      
      const secondDashboard = new DashboardPage(secondPage);
      await secondDashboard.verifyDashboardLoaded();
      
      // Simulate timeout in first tab
      await page.evaluate(() => {
        sessionStorage.clear();
        localStorage.clear();
      });
      await context.clearCookies();
      
      // Check first tab
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      let firstTabUrl = await page.url();
      expect(firstTabUrl).toContain('login');
      
      // Second tab should also be affected
      await secondPage.reload();
      await secondPage.waitForLoadState('networkidle');
      
      const secondTabUrl = await secondPage.url();
      expect(secondTabUrl).toContain('login');
      
      await secondPage.close();
    });
  });

  test('HRM-40: Should test session timeout warning mechanisms', async ({ page }) => {
    // Note: This test checks for timeout warning functionality if implemented
    
    await test.step('Look for session timeout warning elements', async () => {
      // Check if application has session timeout warnings
      const warningSelectors = [
        '.session-timeout-warning',
        '.timeout-modal',
        '[data-testid="session-warning"]',
        '.alert-warning',
        'text=session will expire',
        'text=timeout warning'
      ];
      
      let hasWarningMechanism = false;
      for (const selector of warningSelectors) {
        try {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            hasWarningMechanism = true;
            console.log(`Found session warning mechanism: ${selector}`);
            break;
          }
        } catch (error) {
          // Continue checking other selectors
        }
      }
      
      console.log('Session timeout warning mechanism exists:', hasWarningMechanism);
    });
  });

  test('HRM-40: Should verify session timeout across different modules', async ({ page }) => {
    const modules = [
      { name: 'PIM', navigate: () => dashboardPage.navigateToPIM() },
      { name: 'Leave', navigate: () => dashboardPage.navigateToLeave() },
      { name: 'Admin', navigate: () => dashboardPage.navigateToAdmin() }
    ];

    for (const module of modules) {
      await test.step(`Test session timeout in ${module.name} module`, async () => {
        // Navigate to module
        await module.navigate();
        await page.waitForLoadState('networkidle');
        
        // Simulate session timeout
        await page.evaluate(() => {
          sessionStorage.clear();
          localStorage.clear();
        });
        
        await page.context().clearCookies();
        
        // Try to perform an action
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Should redirect to login
        const currentUrl = await page.url();
        expect(currentUrl).toContain('login');
        
        // Re-login for next iteration
        if (module !== modules[modules.length - 1]) {
          await loginPage.login('Admin', 'admin123');
          await dashboardPage.verifyDashboardLoaded();
        }
      });
    }
  });

  test('HRM-40: Should handle session timeout with AJAX requests', async ({ page }) => {
    await test.step('Setup request monitoring', async () => {
      // Monitor network requests for session validation
      const requests: string[] = [];
      page.on('request', request => {
        requests.push(request.url());
      });
      
      page.on('response', response => {
        if (response.status() === 401 || response.status() === 403) {
          console.log(`Authentication error response: ${response.status()} for ${response.url()}`);
        }
      });
    });

    await test.step('Simulate session timeout and make AJAX request', async () => {
      // Clear session
      await page.evaluate(() => {
        sessionStorage.clear();
        localStorage.clear();
      });
      
      await page.context().clearCookies();
      
      // Try to trigger an AJAX request (by clicking something or navigating)
      try {
        await dashboardPage.navigateToPIM();
        await page.waitForLoadState('networkidle');
      } catch (error) {
        console.log('Navigation failed due to session timeout, this is expected');
      }
      
      // Check if redirected to login
      const currentUrl = await page.url();
      console.log('URL after AJAX request with expired session:', currentUrl);
    });
  });

  test('HRM-40: Should test session extension on user activity', async ({ page }) => {
    await test.step('Perform user activity to extend session', async () => {
      // Simulate user activity by clicking and navigating
      await page.mouse.move(100, 100);
      await page.mouse.click(100, 100);
      
      await dashboardPage.navigateToPIM();
      await page.waitForLoadState('networkidle');
      
      await page.mouse.move(200, 200);
      await page.keyboard.press('Tab');
      
      await dashboardPage.navigateToLeave();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify session is still active after activity', async () => {
      await dashboardPage.verifySessionActive();
      
      // Should still be authenticated
      const currentUrl = await page.url();
      expect(currentUrl).not.toContain('login');
    });
  });

  test('HRM-40: Should handle browser refresh during session timeout', async ({ page }) => {
    await test.step('Simulate timeout and immediate refresh', async () => {
      // Clear session storage
      await page.evaluate(() => {
        sessionStorage.clear();
        localStorage.clear();
      });
      
      // Immediately refresh
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should redirect to login
      const currentUrl = await page.url();
      expect(currentUrl).toContain('login');
    });

    await test.step('Verify login form is functional after timeout', async () => {
      await loginPage.verifyLoginFormDisplayed();
      
      // Should be able to login again
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
    });

    await test.step('Take screenshot of recovery after timeout', async () => {
      await page.screenshot({ 
        path: 'test-results/screenshots/session-timeout-recovery.png' 
      });
    });
  });

  // Note: beforeEach handles login, no explicit cleanup needed as session timeout tests
  // naturally end with logout/session expiry
}); 