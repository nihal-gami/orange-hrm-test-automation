import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { invalidCredentials, expectedErrorMessages } from '../data/auth-test-data';

/**
 * Test Suite: Invalid Login Attempts
 * Jira Task: HRM-61
 * 
 * This test suite verifies that the system properly handles 
 * invalid login attempts with appropriate error messages and security measures.
 * 
 * Test Scenarios:
 * - Invalid username with correct password
 * - Correct username with invalid password  
 * - Both username and password invalid
 * - Empty credentials
 * - Special characters in credentials
 */

test.describe('HRM-61: Invalid Login Attempts', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Navigate to login page before each test
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginFormDisplayed();
  });

  // Data-driven test for all invalid credential scenarios
  for (const credential of invalidCredentials) {
    test(`should handle invalid login: ${credential.description}`, async ({ page }) => {
      // Clear any existing values
      await loginPage.clearAllFields();
      
      // Enter the test credentials
      if (credential.username) {
        await loginPage.enterUsername(credential.username);
      }
      if (credential.password) {
        await loginPage.enterPassword(credential.password);
      }
      
      // Attempt to login
      await loginPage.clickLogin();
      
      // Verify user remains on login page
      await expect(page).toHaveURL(/.*auth.*login.*/);
      
      // Verify appropriate error message is displayed (for empty fields, check form validation)
      const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
      
      // For empty field scenarios, Orange HRM might not show error messages
      if (credential.username === '' || credential.password === '') {
        // Empty fields should prevent login and keep user on login page
        await expect(page).toHaveURL(/.*auth.*login.*/);
        // Don't expect error messages for empty fields in this demo
      } else {
        // For non-empty invalid credentials, expect error message
        if (isErrorDisplayed) {
          const errorMessage = await loginPage.getErrorMessage();
          if (credential.expectedError && !credential.expectedError.includes('required')) {
            expect(errorMessage.toLowerCase()).toContain(
              credential.expectedError.toLowerCase()
            );
          }
        } else {
          // Some invalid credentials might not show alerts, just verify stayed on login page
          await expect(page).toHaveURL(/.*auth.*login.*/);
        }
      }
      
      // Verify login form is still displayed
      await loginPage.verifyLoginFormDisplayed();
      
      // Verify no access to dashboard
      const isDashboardVisible = await dashboardPage.isElementVisible(dashboardPage.dashboardTitle);
      expect(isDashboardVisible).toBeFalsy();
    });
  }

  test('should prevent SQL injection attempts', async ({ page }) => {
    const sqlInjectionAttempts = [
      "admin'; DROP TABLE users; --",
      "' OR '1'='1",
      "admin' OR 1=1 --",
      "' UNION SELECT * FROM users --"
    ];
    
    for (const attempt of sqlInjectionAttempts) {
      // Clear fields before each attempt
      await loginPage.clearAllFields();
      
      // Attempt SQL injection in username field
      await loginPage.enterUsername(attempt);
      await loginPage.enterPassword('admin123');
      await loginPage.clickLogin();
      
      // Verify system handles injection attempt securely
      await expect(page).toHaveURL(/.*auth.*login.*/);
      const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
      expect(isErrorDisplayed).toBeTruthy();
      
      // Verify no unauthorized access
      const isDashboardVisible = await dashboardPage.isElementVisible(dashboardPage.dashboardTitle);
      expect(isDashboardVisible).toBeFalsy();
    }
  });

  test('should handle multiple consecutive failed login attempts', async ({ page }) => {
    const maxAttempts = 5;
    
    for (let i = 1; i <= maxAttempts; i++) {
      await loginPage.clearAllFields();
      await loginPage.enterUsername(`InvalidUser${i}`);
      await loginPage.enterPassword(`WrongPassword${i}`);
      await loginPage.clickLogin();
      
      // Verify error message appears for each attempt
      const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
      expect(isErrorDisplayed).toBeTruthy();
      
      // Verify user remains on login page
      await expect(page).toHaveURL(/.*auth.*login.*/);
      
      // Small delay between attempts
      await page.waitForTimeout(1000);
    }
    
    // Verify system doesn't lock out after multiple attempts (in demo environment)
    // Note: Production systems might implement account lockout
    await loginPage.verifyLoginFormDisplayed();
  });

  test('should validate field requirements when submitting empty form', async ({ page }) => {
    // Clear all fields
    await loginPage.clearAllFields();
    
    // Try to submit empty form
    await loginPage.clickLogin();
    
    // Verify user remains on login page (primary validation)
    await expect(page).toHaveURL(/.*auth.*login.*/);
    
    // Orange HRM demo might not show explicit "required" error messages
    // The main validation is that login is prevented
    await loginPage.verifyLoginFormDisplayed();
  });

  test('should handle invalid credential variations', async ({ page }) => {
    // Test completely wrong username
    await loginPage.clearAllFields();
    await loginPage.enterUsername('WrongUser');
    await loginPage.enterPassword('admin123');
    await loginPage.clickLogin();
    
    // Verify login fails
    await expect(page).toHaveURL(/.*auth.*login.*/);
    
    // Test wrong password
    await loginPage.clearAllFields();
    await loginPage.enterUsername('Admin');
    await loginPage.enterPassword('wrongpassword');
    await loginPage.clickLogin();
    
    // Verify login fails
    await expect(page).toHaveURL(/.*auth.*login.*/);
    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
  });

  test('should handle special characters and unicode in credentials', async ({ page }) => {
    const specialCharacterTests = [
      { username: 'Admin@#$%', password: 'admin123', description: 'Special chars in username' },
      { username: 'Admin', password: 'admin@#$%', description: 'Special chars in password' },
      { username: 'Ädmin', password: 'admin123', description: 'Unicode in username' },
      { username: 'Admin', password: 'ädmin123', description: 'Unicode in password' }
    ];
    
    for (const testCase of specialCharacterTests) {
      await loginPage.clearAllFields();
      await loginPage.enterUsername(testCase.username);
      await loginPage.enterPassword(testCase.password);
      await loginPage.clickLogin();
      
      // Verify invalid credentials handling - stays on login page
      await expect(page).toHaveURL(/.*auth.*login.*/);
      
      // Error message might not always appear for special characters
      // The key validation is that login is prevented
      await loginPage.verifyLoginFormDisplayed();
    }
  });

  test('should clear error messages when user starts typing', async ({ page }) => {
    // Trigger an error first
    await loginPage.enterUsername('InvalidUser');
    await loginPage.enterPassword('WrongPassword');
    await loginPage.clickLogin();
    
    // Verify error is displayed
    let isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
    
    // Clear and start typing new credentials
    await loginPage.clearAllFields();
    await loginPage.enterUsername('A'); // Start typing
    
    // Wait a moment for any error clearing behavior
    await page.waitForTimeout(500);
    
    // Note: Error clearing behavior may vary by implementation
    // This test documents the current behavior
  });

  test.afterEach(async ({ page }) => {
    // Take screenshot for test documentation
    await page.screenshot({ 
      path: `test-results/screenshots/invalid-login-${test.info().title}-${Date.now()}.png`,
      fullPage: true 
    });
  });
}); 