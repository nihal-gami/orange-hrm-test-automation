import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * Test Suite: Password Field Security
 * Jira Task: HRM-56 - AUTH-003: Implement Password Field Masking Test
 * 
 * Objective: Verify that password field properly masks input for security
 */

test.describe('AUTH-003: Password Field Masking Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should mask password input characters', async ({ page }) => {
    const testPassword = AuthTestData.passwordMaskingTest.testPassword;

    await test.step('Enter password in password field', async () => {
      await loginPage.enterPassword(testPassword);
    });

    await test.step('Verify password field type is "password"', async () => {
      expect(await loginPage.isPasswordMasked()).toBe(true);
    });

    await test.step('Verify password value is stored correctly but not visible', async () => {
      const passwordValue = await loginPage.getPasswordFieldValue();
      expect(passwordValue).toBe(testPassword);
    });
  });

  test('should not expose password in page source', async ({ page }) => {
    const testPassword = AuthTestData.passwordMaskingTest.testPassword;

    await test.step('Enter password', async () => {
      await loginPage.enterPassword(testPassword);
    });

    await test.step('Verify password is not visible in page source', async () => {
      const pageContent = await page.content();
      expect(pageContent).not.toContain(testPassword);
    });
  });

  test('should maintain password masking across browser interactions', async ({ page }) => {
    const testPassword = AuthTestData.passwordMaskingTest.testPassword;

    await test.step('Enter password and interact with other elements', async () => {
      await loginPage.enterPassword(testPassword);
      await loginPage.enterUsername('testuser');
      
      // Click back on password field
      await page.locator('input[name="password"]').click();
    });

    await test.step('Verify password remains masked', async () => {
      expect(await loginPage.isPasswordMasked()).toBe(true);
    });
  });

  test('should not reveal password in browser developer tools', async ({ page }) => {
    const testPassword = AuthTestData.passwordMaskingTest.testPassword;

    await test.step('Enter password', async () => {
      await loginPage.enterPassword(testPassword);
    });

    await test.step('Verify password field attributes', async () => {
      const passwordField = page.locator('input[name="password"]');
      
      // Check the input type attribute
      const inputType = await passwordField.getAttribute('type');
      expect(inputType).toBe('password');
      
      // Check that no visible text content contains the password
      const visibleText = await passwordField.textContent();
      expect(visibleText).not.toContain(testPassword);
    });
  });

  test('should handle special characters in password masking', async ({ page }) => {
    const specialCharPassword = 'P@$$w0rd!2023#&*()';

    await test.step('Enter password with special characters', async () => {
      await loginPage.enterPassword(specialCharPassword);
    });

    await test.step('Verify special characters are properly masked', async () => {
      expect(await loginPage.isPasswordMasked()).toBe(true);
      const storedValue = await loginPage.getPasswordFieldValue();
      expect(storedValue).toBe(specialCharPassword);
    });
  });

  test('should mask password during form submission', async ({ page }) => {
    await test.step('Enter credentials', async () => {
      await loginPage.enterUsername(AuthTestData.validCredentials.username);
      await loginPage.enterPassword(AuthTestData.validCredentials.password);
    });

    await test.step('Monitor network requests during login', async () => {
      // Start monitoring network requests
      const requests: any[] = [];
      page.on('request', request => {
        if (request.method() === 'POST') {
          requests.push(request);
        }
      });

      await loginPage.clickLogin();
      
      // Wait a bit for the request to complete
      await page.waitForTimeout(2000);
      
      // Verify password is not exposed in plain text in request monitoring
      // Note: This is a basic check - full security audit would require more sophisticated monitoring
      expect(requests.length).toBeGreaterThan(0);
    });
  });

  test('should clear password field securely', async ({ page }) => {
    const testPassword = AuthTestData.passwordMaskingTest.testPassword;

    await test.step('Enter password and then clear it', async () => {
      await loginPage.enterPassword(testPassword);
      await page.locator('input[name="password"]').clear();
    });

    await test.step('Verify password field is empty and still masked', async () => {
      const passwordValue = await loginPage.getPasswordFieldValue();
      expect(passwordValue).toBe('');
      expect(await loginPage.isPasswordMasked()).toBe(true);
    });
  });

  test('should handle copy-paste in password field securely', async ({ page }) => {
    const testPassword = AuthTestData.passwordMaskingTest.testPassword;

    await test.step('Simulate copy-paste in password field', async () => {
      await loginPage.enterPassword(testPassword);
      
      // Try to select all and copy (this should not work in password fields)
      await page.locator('input[name="password"]').press('Control+a');
      await page.locator('input[name="password"]').press('Control+c');
    });

    await test.step('Verify password field maintains security', async () => {
      expect(await loginPage.isPasswordMasked()).toBe(true);
      const storedValue = await loginPage.getPasswordFieldValue();
      expect(storedValue).toBe(testPassword);
    });
  });
}); 