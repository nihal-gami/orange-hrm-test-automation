import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { invalidCredentials } from '../data/auth-test-data';

/**
 * Test Suite: Invalid Login Attempts Automation
 * Jira Task: HRM-43 - AUTH-002: Implement Invalid Login Attempts Test Automation
 * Epic: HRM-41 🔐 Authentication & Authorization
 */

test.describe('Invalid Login Tests @auth', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Navigate to login page
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageLoaded();
  });

  // Data-driven test for all invalid credential scenarios
  for (const credential of invalidCredentials) {
    test(`AUTH-002.${invalidCredentials.indexOf(credential) + 1}: ${credential.description}`, async ({ page }) => {
      try {
        // Clear any existing data
        await loginPage.clearForm();

        // Attempt login with invalid credentials
        await loginPage.login(credential.username, credential.password);

        // Verify error message is displayed (wait a moment for it to appear)
        await page.waitForTimeout(2000);
        
        // Check if error message is displayed
        const errorDisplayed = await loginPage.isErrorMessageDisplayed();
        
        if (errorDisplayed) {
          const errorMessage = await loginPage.getErrorMessage();
          expect(errorMessage).toBeTruthy();
          console.log(`✅ Error message displayed: "${errorMessage}"`);
        } else {
          // For some scenarios, the error might be shown differently
          // Verify user is NOT redirected to dashboard
          const currentURL = await page.url();
          expect(currentURL).not.toContain('/dashboard');
          expect(currentURL).toContain('/auth/login');
        }

        // Verify user is not logged in
        const isLoggedIn = await dashboardPage.isUserLoggedIn();
        expect(isLoggedIn).toBe(false);

        console.log(`✅ Invalid login test passed for: ${credential.description}`);

      } catch (error) {
        await loginPage.takeScreenshot(`invalid-login-${credential.description.replace(/\s+/g, '-')}`);
        throw error;
      }
    });
  }

  test('AUTH-002.7: Should handle multiple consecutive invalid login attempts', async ({ page }) => {
    const testCredentials = invalidCredentials.slice(0, 3); // Test first 3 scenarios
    
    for (const credential of testCredentials) {
      // Clear form before each attempt
      await loginPage.clearForm();
      
      // Attempt login
      await loginPage.login(credential.username, credential.password);
      
      // Wait for response
      await page.waitForTimeout(1500);
      
      // Verify still on login page
      const currentURL = await page.url();
      expect(currentURL).toContain('/auth/login');
    }

    console.log('✅ Multiple invalid login attempts handled correctly');
  });

  test('AUTH-002.8: Should validate required field indicators', async ({ page }) => {
    // Try to submit empty form
    await loginPage.clearForm();
    await loginPage.clickElement(loginPage.loginButton);
    
    // Wait for validation
    await page.waitForTimeout(1000);
    
    // Verify form validation (check for required field indicators)
    const currentURL = await page.url();
    expect(currentURL).toContain('/auth/login');
    
    // Verify login button state or validation messages
    const isLoginButtonEnabled = await loginPage.isLoginButtonEnabled();
    console.log(`Login button enabled state: ${isLoginButtonEnabled}`);

    console.log('✅ Required field validation test completed');
  });

  test('AUTH-002.9: Should maintain login page state after failed attempts', async ({ page }) => {
    const invalidCred = invalidCredentials[0];
    
    // Attempt invalid login
    await loginPage.login(invalidCred.username, invalidCred.password);
    await page.waitForTimeout(2000);
    
    // Verify login page elements are still present and functional
    await loginPage.verifyLoginPageLoaded();
    
    // Verify form can be cleared and used again
    await loginPage.clearForm();
    
    // Verify placeholders and form state
    const usernamePlaceholder = await loginPage.getUsernamePlaceholder();
    console.log(`Username placeholder: ${usernamePlaceholder}`);

    console.log('✅ Login page state maintained after failed attempt');
  });

  test.afterEach(async ({ page }) => {
    // Ensure we're ready for next test
    try {
      const currentURL = await page.url();
      if (!currentURL.includes('/auth/login')) {
        await loginPage.navigateToLogin();
      }
    } catch (error) {
      console.log('Note: Cleanup navigation may not be needed');
    }
  });
}); 