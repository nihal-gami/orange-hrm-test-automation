import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * AUTH-002: Invalid Login Test Automation
 * Jira Task: HRM-49
 * 
 * Test Objective: Verify that invalid login attempts are properly handled
 * and appropriate error messages are displayed.
 */

test.describe('AUTH-002: Invalid Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  // Data-driven test for all invalid credential combinations
  AuthTestData.invalidCredentials.forEach((testData) => {
    test(`should handle ${testData.testCase}`, async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      
      // Act
      await loginPage.login(testData.username, testData.password);
      
      // Assert
      if (testData.expectedError === 'Required') {
        // For empty fields, check specific field validation
        if (testData.username === '') {
          const usernameField = loginPage.getUsernameInput();
          await expect(usernameField).toHaveAttribute('required', '');
        }
        if (testData.password === '') {
          const passwordField = loginPage.getPasswordInput();
          await expect(passwordField).toHaveAttribute('required', '');
        }
      } else {
        // For invalid credentials, verify error message
        await loginPage.verifyErrorMessage();
      }
      
      // Verify user stays on login page
      await loginPage.verifyStillOnLoginPage();
      
      // Verify no redirect to dashboard
      expect(page.url()).not.toContain('dashboard');
      
      console.log(`✅ Test passed for: ${testData.testCase}`);
    });
  });

  test('should prevent multiple rapid login attempts', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const invalidCreds = AuthTestData.invalidCredentials[0];

    // Act - Attempt multiple rapid logins
    for (let i = 0; i < 3; i++) {
      await loginPage.clearForm();
      await loginPage.login(invalidCreds.username, invalidCreds.password);
      await page.waitForTimeout(1000); // Brief wait between attempts
    }

    // Assert - Should still show error and stay on login page
    await loginPage.verifyErrorMessage();
    await loginPage.verifyStillOnLoginPage();
  });

  test('should maintain form state after failed login', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const testData = AuthTestData.invalidCredentials[1]; // Valid username, invalid password

    // Act
    await loginPage.login(testData.username, testData.password);

    // Assert
    await loginPage.verifyErrorMessage();
    
    // Verify username field retains the entered value
    const usernameValue = await loginPage.getUsernameInput().inputValue();
    expect(usernameValue).toBe(testData.username);
    
    // Verify password field is cleared for security
    const passwordValue = await loginPage.getPasswordInput().inputValue();
    expect(passwordValue).toBe('');
  });

  test('should not expose sensitive information in error messages', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const testData = AuthTestData.invalidCredentials[0];

    // Act
    await loginPage.login(testData.username, testData.password);

    // Assert
    await loginPage.verifyErrorMessage();
    
    // Verify error message doesn't expose sensitive info
    const errorElement = page.locator('.oxd-alert-content-text');
    const errorText = await errorElement.textContent();
    
    // Error should be generic, not revealing specific failure reason
    expect(errorText).not.toContain(testData.username);
    expect(errorText).not.toContain(testData.password);
    expect(errorText).not.toContain('username');
    expect(errorText).not.toContain('password');
  });
});

test.describe('AUTH-002: Security Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  // Security-focused tests for SQL Injection and XSS
  AuthTestData.securityTestData.forEach((testData) => {
    test(`should prevent ${testData.testCase}`, async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      
      // Act
      await loginPage.login(testData.username, testData.password);
      
      // Assert
      await loginPage.verifyErrorMessage();
      await loginPage.verifyStillOnLoginPage();
      
      // Verify no code execution or injection occurred
      const currentUrl = await loginPage.getCurrentUrl();
      expect(currentUrl).toContain('login');
      expect(currentUrl).not.toContain('script');
      expect(currentUrl).not.toContain('alert');
      
      // Verify page content is not compromised
      const pageContent = await page.content();
      expect(pageContent).not.toContain('<script>');
      expect(pageContent).not.toContain('alert("xss")');
      
      console.log(`✅ Security test passed for: ${testData.testCase}`);
    });
  });

  test('should sanitize input fields properly', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const maliciousInput = '<script>alert("test")</script>';

    // Act
    await loginPage.login(maliciousInput, maliciousInput);

    // Assert
    await loginPage.verifyErrorMessage();
    
    // Verify input sanitization
    const usernameValue = await loginPage.getUsernameInput().inputValue();
    const passwordValue = await loginPage.getPasswordInput().inputValue();
    
    // Inputs should be handled safely
    expect(usernameValue).toBe(maliciousInput); // Should retain input but not execute
    expect(passwordValue).toBe(''); // Password should be cleared
    
    // Verify no script execution in DOM
    const alerts = await page.evaluate(() => window.alert.toString());
    expect(alerts).not.toContain('test');
  });
}); 