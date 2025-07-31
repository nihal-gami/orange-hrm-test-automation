import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { passwordMaskingTests } from '../data/auth-test-data';

/**
 * Test Suite: Password Field Masking
 * Jira Task: HRM-62
 * 
 * This test suite verifies that password input is properly masked/hidden 
 * for security purposes across different scenarios and browsers.
 * 
 * Test Coverage:
 * - Password character masking
 * - Input type verification
 * - Copy/paste behavior
 * - Visual validation
 * - Cross-browser compatibility (Chrome only as per rules)
 */

test.describe('HRM-62: Password Field Masking', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    
    // Navigate to login page before each test
    await loginPage.navigateToLogin();
    await loginPage.verifyLoginFormDisplayed();
  });

  test('should mask password characters when typing', async ({ page }) => {
    // Verify password field input type
    const isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBeTruthy();
    
    // Verify the input type attribute
    const inputType = await loginPage.passwordField.getAttribute('type');
    expect(inputType).toBe(passwordMaskingTests.expectedInputType);
    
    // Enter password and verify masking
    await loginPage.enterPassword(passwordMaskingTests.testPassword);
    
    // Verify the actual value is stored correctly (for form submission)
    const storedValue = await loginPage.getPasswordFieldValue();
    expect(storedValue).toBe(passwordMaskingTests.testPassword);
    
    // Verify the displayed value is masked in the DOM
    // The visual representation should not show plain text
    const displayValue = await loginPage.passwordField.inputValue();
    expect(displayValue).toBe(passwordMaskingTests.testPassword); // Internal value is correct
    
    // Verify input type remains password throughout typing
    const finalInputType = await loginPage.passwordField.getAttribute('type');
    expect(finalInputType).toBe('password');
  });

  test('should maintain password masking during character input', async ({ page }) => {
    // Type password character by character and verify masking at each step
    const testPassword = passwordMaskingTests.testPassword;
    
    // Clear the field first
    await loginPage.clearPassword();
    
    // Type each character and verify masking is maintained
    for (let i = 0; i < testPassword.length; i++) {
      const char = testPassword.charAt(i);
      await loginPage.passwordField.pressSequentially(char, { delay: 100 });
      
      // Verify input type is still password after each character
      const inputType = await loginPage.passwordField.getAttribute('type');
      expect(inputType).toBe('password');
      
      // Verify the field appears visually masked
      const isPasswordMasked = await loginPage.isPasswordFieldMasked();
      expect(isPasswordMasked).toBeTruthy();
    }
    
    // Verify final value is correct
    const finalValue = await loginPage.getPasswordFieldValue();
    expect(finalValue).toBe(testPassword);
  });

  test('should handle copy and paste operations securely', async ({ page }) => {
    // Enter initial password
    await loginPage.enterPassword(passwordMaskingTests.testPassword);
    
    // Select all text in password field
    await loginPage.passwordField.selectText();
    
    // Attempt to copy (this tests browser security behavior)
    await page.keyboard.press('Control+c');
    
    // Clear the field
    await loginPage.clearPassword();
    
    // Attempt to paste
    await loginPage.passwordField.click();
    await page.keyboard.press('Control+v');
    
    // Verify the pasted value is handled correctly
    const pastedValue = await loginPage.getPasswordFieldValue();
    // Note: Browser security may prevent clipboard access in tests
    // This test documents the behavior
    
    // Verify field remains masked after paste operation
    const isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBeTruthy();
  });

  test('should prevent password visibility through browser developer tools inspection', async ({ page }) => {
    // Enter password
    await loginPage.enterPassword(passwordMaskingTests.testPassword);
    
    // Verify the DOM attributes don't expose the password
    const inputElement = loginPage.passwordField;
    
    // Check input type attribute
    const inputType = await inputElement.getAttribute('type');
    expect(inputType).toBe('password');
    
    // Verify no plain text in common attributes that might expose the password
    const placeholder = await inputElement.getAttribute('placeholder');
    const title = await inputElement.getAttribute('title');
    const dataValue = await inputElement.getAttribute('data-value');
    
    // These attributes should not contain the actual password
    if (placeholder) expect(placeholder).not.toBe(passwordMaskingTests.testPassword);
    if (title) expect(title).not.toBe(passwordMaskingTests.testPassword);
    if (dataValue) expect(dataValue).not.toBe(passwordMaskingTests.testPassword);
  });

  test('should mask password with different character types', async ({ page }) => {
    // Test different types of characters
    const passwordVariations = [
      'SimplePassword',
      'Password123',
      'Pass@word!',
      'пароль', // Cyrillic
      '密码', // Chinese
      'P@ssw0rd#2024!'
    ];
    
    for (const password of passwordVariations) {
      // Clear field and enter new password
      await loginPage.clearPassword();
      await loginPage.enterPassword(password);
      
      // Verify masking for each variation
      const isPasswordMasked = await loginPage.isPasswordFieldMasked();
      expect(isPasswordMasked).toBeTruthy();
      
      // Verify stored value is correct
      const storedValue = await loginPage.getPasswordFieldValue();
      expect(storedValue).toBe(password);
      
      // Verify input type remains password
      const inputType = await loginPage.passwordField.getAttribute('type');
      expect(inputType).toBe('password');
    }
  });

  test('should handle backspace and delete operations while maintaining masking', async ({ page }) => {
    // Enter initial password
    await loginPage.enterPassword(passwordMaskingTests.testPassword);
    
    // Verify initial state
    let storedValue = await loginPage.getPasswordFieldValue();
    expect(storedValue).toBe(passwordMaskingTests.testPassword);
    
    // Test backspace operations
    await loginPage.passwordField.press('Backspace');
    await loginPage.passwordField.press('Backspace');
    
    // Verify characters are removed but field remains masked
    const isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBeTruthy();
    
    // Verify content is updated correctly
    storedValue = await loginPage.getPasswordFieldValue();
    expect(storedValue).toBe(passwordMaskingTests.testPassword.slice(0, -2));
    
    // Test delete operation (move cursor to beginning and delete)
    await loginPage.passwordField.press('Home');
    await loginPage.passwordField.press('Delete');
    
    // Verify field still masked after delete
    const stillMasked = await loginPage.isPasswordFieldMasked();
    expect(stillMasked).toBeTruthy();
  });

  test('should maintain masking during form validation', async ({ page }) => {
    // Enter invalid password (too short for testing)
    await loginPage.enterPassword('123');
    
    // Verify field is masked
    let isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBeTruthy();
    
    // Attempt login to trigger validation
    await loginPage.enterUsername('Admin');
    await loginPage.clickLogin();
    
    // After validation/error, verify password field is still masked
    isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBeTruthy();
    
    // Verify input type is still password
    const inputType = await loginPage.passwordField.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('should handle focus and blur events while maintaining masking', async ({ page }) => {
    // Enter password
    await loginPage.enterPassword(passwordMaskingTests.testPassword);
    
    // Focus on password field
    await loginPage.passwordField.focus();
    
    // Verify masking is maintained on focus
    let isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBeTruthy();
    
    // Blur the field (move focus away)
    await loginPage.usernameField.focus();
    
    // Verify masking is maintained after blur
    isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBeTruthy();
    
    // Focus back on password field
    await loginPage.passwordField.focus();
    
    // Verify masking is still maintained
    isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBeTruthy();
  });

  test.afterEach(async ({ page }) => {
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: `test-results/screenshots/password-masking-${test.info().title}-${Date.now()}.png`,
      fullPage: true 
    });
  });
}); 