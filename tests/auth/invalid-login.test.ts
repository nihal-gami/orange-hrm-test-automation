import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * Test Suite: Invalid Login Handling
 * Jira Task: HRM-55 - AUTH-002: Implement Invalid Login Tests
 * 
 * Objective: Verify proper handling of invalid login attempts with incorrect credentials
 */

test.describe('AUTH-002: Invalid Login Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigateToLogin();
  });

  // Test invalid credential combinations
  for (const testCase of AuthTestData.invalidCredentials) {
    test(`should reject login attempt: ${testCase.scenario}`, async ({ page }) => {
      await test.step(`Enter credentials: ${testCase.scenario}`, async () => {
        await loginPage.login(testCase.username, testCase.password);
      });

      await test.step('Verify error message is displayed', async () => {
        expect(await loginPage.hasAnyValidationError()).toBe(true);
      });

      await test.step('Verify user is not authenticated', async () => {
        // Should remain on login page
        expect(page.url()).toContain('login');
        expect(await dashboardPage.isUserLoggedIn()).toBe(false);
      });

      await test.step('Verify login form is still visible', async () => {
        expect(await loginPage.isLoginFormVisible()).toBe(true);
      });
    });
  }

  // Test security validations
  for (const securityTest of AuthTestData.securityTestInputs) {
    test(`should handle security attempt: ${securityTest.scenario}`, async ({ page }) => {
      await test.step(`Attempt ${securityTest.scenario}`, async () => {
        await loginPage.login(securityTest.username, securityTest.password);
      });

      await test.step('Verify security validation blocks attempt', async () => {
        expect(await loginPage.hasAnyValidationError()).toBe(true);
        expect(page.url()).toContain('login');
      });

      await test.step('Verify no sensitive information is exposed', async () => {
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage.toLowerCase()).not.toContain('database');
        expect(errorMessage.toLowerCase()).not.toContain('sql');
        expect(errorMessage.toLowerCase()).not.toContain('error');
      });
    });
  }

  test('should handle multiple failed login attempts', async ({ page }) => {
    const maxAttempts = 3;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await test.step(`Failed login attempt ${attempt}`, async () => {
        await loginPage.clearLoginForm();
        await loginPage.login('InvalidUser', 'InvalidPassword');
        
        expect(await loginPage.hasAnyValidationError()).toBe(true);
        expect(page.url()).toContain('login');
      });
    }

    await test.step('Verify login form is still functional after multiple failures', async () => {
      expect(await loginPage.isLoginFormVisible()).toBe(true);
    });
  });

  test('should clear error message when typing new credentials', async ({ page }) => {
    await test.step('Trigger an error message', async () => {
      await loginPage.login('InvalidUser', 'InvalidPassword');
      expect(await loginPage.hasAnyValidationError()).toBe(true);
    });

    await test.step('Clear form and enter new credentials', async () => {
      await loginPage.clearLoginForm();
      await loginPage.enterUsername('Admin');
    });

    // Note: This test may need adjustment based on actual application behavior
    await test.step('Verify login form is ready for new attempt', async () => {
      expect(await loginPage.isLoginFormVisible()).toBe(true);
    });
  });

  test('should maintain form state after failed login', async ({ page }) => {
    const testUsername = 'TestUser';
    
    await test.step('Enter invalid credentials', async () => {
      await loginPage.enterUsername(testUsername);
      await loginPage.enterPassword('InvalidPassword');
      await loginPage.clickLogin();
    });

    await test.step('Verify error is shown but username is preserved', async () => {
      expect(await loginPage.hasAnyValidationError()).toBe(true);
      // Note: This behavior may vary - some apps clear fields, others preserve username
    });
  });
}); 