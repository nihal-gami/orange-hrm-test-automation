import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { securityTestData } from '../data/auth-test-data';

/**
 * Test Suite: Password Field Masking Security Tests
 * Jira Task: HRM-44 - AUTH-003: Implement Password Field Masking Test Automation
 * Epic: HRM-41 🔐 Authentication & Authorization
 */

test.describe('Password Field Security Tests @auth', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    
    // Navigate to login page
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginPageLoaded();
  });

  test('AUTH-003.1: Should mask password field input', async ({ page }) => {
    try {
      // Verify password field type is 'password'
      const passwordFieldType = await loginPage.getPasswordInputType();
      expect(passwordFieldType).toBe(securityTestData.passwordFieldType);

      // Verify password field masks input
      await loginPage.verifyPasswordFieldMasked();

      console.log('✅ Password field masking verified successfully');

    } catch (error) {
      await loginPage.takeScreenshot('password-masking-failure');
      throw error;
    }
  });

  test('AUTH-003.2: Should not expose password in DOM or page source', async ({ page }) => {
    const testPassword = 'admin123';
    
    try {
      // Fill password field
      await loginPage.fillText(loginPage.passwordInput, testPassword);

      // Get page content/source
      const pageContent = await page.content();
      
      // Verify password is not visible in plain text in page source
      const plainTextPasswordFound = pageContent.includes(`value="${testPassword}"`);
      expect(plainTextPasswordFound).toBe(false);

      // Check for common password exposure patterns
      for (const pattern of securityTestData.sensitiveDataPatterns) {
        if (pattern.source.includes('admin123')) {
          const sensitiveDataFound = pattern.test(pageContent);
          expect(sensitiveDataFound).toBe(false);
        }
      }

      console.log('✅ Password not exposed in DOM or page source');

    } catch (error) {
      await loginPage.takeScreenshot('password-exposure-check');
      throw error;
    }
  });

  test('AUTH-003.3: Should maintain password masking during input', async ({ page }) => {
    const testPassword = 'testPassword123';
    
    try {
      // Type password character by character and verify masking is maintained
      await loginPage.passwordInput.click();
      
      for (let i = 0; i < testPassword.length; i++) {
        await page.keyboard.type(testPassword[i]);
        
        // Verify field type is still password
        const fieldType = await loginPage.getPasswordInputType();
        expect(fieldType).toBe('password');
      }

      // Verify field value is set but not visible
      const inputValue = await loginPage.passwordInput.inputValue();
      expect(inputValue).toBe(testPassword);

      // But verify it's masked in the UI
      const displayValue = await loginPage.passwordInput.textContent();
      expect(displayValue).not.toBe(testPassword);

      console.log('✅ Password masking maintained during character input');

    } catch (error) {
      await loginPage.takeScreenshot('password-masking-during-input');
      throw error;
    }
  });

  test('AUTH-003.4: Should handle copy-paste operations securely', async ({ page }) => {
    const testPassword = 'pastedPassword123';
    
    try {
      // Focus password field
      await loginPage.passwordInput.click();
      
      // Simulate copy-paste operation
      await page.evaluate((password) => {
        navigator.clipboard.writeText(password);
      }, testPassword);
      
      // Paste into password field
      await page.keyboard.press('Control+v');
      
      // Verify password is set but still masked
      const fieldType = await loginPage.getPasswordInputType();
      expect(fieldType).toBe('password');
      
      const inputValue = await loginPage.passwordInput.inputValue();
      expect(inputValue).toBe(testPassword);

      console.log('✅ Copy-paste operations handled securely');

    } catch (error) {
      await loginPage.takeScreenshot('password-copy-paste-security');
      throw error;
    }
  });

  test('AUTH-003.5: Should verify password field attributes and security properties', async ({ page }) => {
    try {
      // Verify password field has correct attributes
      const passwordField = loginPage.passwordInput;
      
      // Check type attribute
      const typeAttr = await passwordField.getAttribute('type');
      expect(typeAttr).toBe('password');
      
      // Check autocomplete attribute (should be off or not present for security)
      const autocompleteAttr = await passwordField.getAttribute('autocomplete');
      if (autocompleteAttr) {
        expect(autocompleteAttr).toMatch(/off|new-password|current-password/);
      }

      // Verify field doesn't have readonly attribute
      const readonlyAttr = await passwordField.getAttribute('readonly');
      expect(readonlyAttr).toBeNull();

      // Verify field is editable
      const isEditable = await passwordField.isEditable();
      expect(isEditable).toBe(true);

      console.log('✅ Password field attributes and security properties verified');

    } catch (error) {
      await loginPage.takeScreenshot('password-field-attributes');
      throw error;
    }
  });

  test('AUTH-003.6: Should maintain masking after form interactions', async ({ page }) => {
    const testPassword = 'interactionTest123';
    
    try {
      // Fill password field
      await loginPage.fillText(loginPage.passwordInput, testPassword);
      
      // Click on username field and back to password field
      await loginPage.usernameInput.click();
      await loginPage.passwordInput.click();
      
      // Verify password is still masked
      const fieldType = await loginPage.getPasswordInputType();
      expect(fieldType).toBe('password');
      
      // Clear and refill
      await loginPage.passwordInput.clear();
      await loginPage.fillText(loginPage.passwordInput, testPassword);
      
      // Verify still masked after clear and refill
      const finalFieldType = await loginPage.getPasswordInputType();
      expect(finalFieldType).toBe('password');

      console.log('✅ Password masking maintained after form interactions');

    } catch (error) {
      await loginPage.takeScreenshot('password-form-interactions');
      throw error;
    }
  });

  test.afterEach(async ({ page }) => {
    // Clear password field for security
    try {
      await loginPage.passwordInput.clear();
    } catch (error) {
      console.log('Note: Password field may already be cleared');
    }
  });
}); 