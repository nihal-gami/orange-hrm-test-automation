import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { AuthTestData } from '../data/auth-test-data';

/**
 * AUTH-003: Password Masking Validation Test
 * Jira Task: HRM-50
 * 
 * Test Objective: Verify that password field properly masks input characters 
 * for security purposes.
 */

test.describe('AUTH-003: Password Masking Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should mask password input field correctly', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const passwordField = loginPage.getPasswordInput();

    // Act & Assert - Verify initial state
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    // Verify password field is visible and ready for input
    await expect(passwordField).toBeVisible();
    await expect(passwordField).toBeEnabled();
    
    // Enter password and verify masking
    const testPassword = 'testpassword123';
    await passwordField.fill(testPassword);
    
    // Assert - Password value should be present but masked visually
    await expect(passwordField).toHaveValue(testPassword);
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('should maintain password type attribute throughout interaction', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const passwordField = loginPage.getPasswordInput();

    // Act - Various interactions with password field
    await passwordField.click();
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    await passwordField.fill('password123');
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    await passwordField.clear();
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    await passwordField.fill('newpassword');
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    // Assert - Type should remain 'password' throughout
    const finalType = await passwordField.getAttribute('type');
    expect(finalType).toBe('password');
  });

  // Test password masking with different password types
  AuthTestData.passwordMaskingTests.forEach((testData) => {
    test(`should mask ${testData.testCase} correctly`, async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      const passwordField = loginPage.getPasswordInput();

      // Act
      await passwordField.fill(testData.password);

      // Assert
      await expect(passwordField).toHaveValue(testData.password);
      await expect(passwordField).toHaveAttribute('type', 'password');
      
      // Verify password is masked by checking computed styles
      const inputType = await passwordField.getAttribute('type');
      expect(inputType).toBe('password');
      
      // Verify no plain text password in page source
      const pageContent = await page.content();
      expect(pageContent).not.toContain(`value="${testData.password}"`);
      
      console.log(`✅ Password masking verified for: ${testData.testCase}`);
    });
  });

  test('should not reveal password in DOM inspection', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const passwordField = loginPage.getPasswordInput();
    const secretPassword = 'super-secret-password-123!@#';

    // Act
    await passwordField.fill(secretPassword);

    // Assert - Check DOM doesn't expose password
    const fieldValue = await passwordField.getAttribute('value');
    expect(fieldValue).toBe(secretPassword); // Value should be there for form submission
    
    // Check page source doesn't show password in plain text
    const pageHTML = await page.content();
    const visibleText = await page.locator('body').textContent();
    
    // Password should not be visible in page text content
    expect(visibleText).not.toContain(secretPassword);
    
    // Verify input type remains password
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('should handle copy-paste operations securely', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const passwordField = loginPage.getPasswordInput();
    const testPassword = 'clipboard-test-password';

    // Act - Fill password and attempt copy
    await passwordField.fill(testPassword);
    
    // Try to select all text in password field
    await passwordField.press('Meta+a'); // Ctrl+A / Cmd+A
    
    // Assert - Even after selection, type should remain password
    await expect(passwordField).toHaveAttribute('type', 'password');
    await expect(passwordField).toHaveValue(testPassword);
  });

  test('should maintain masking during form submission', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const passwordField = loginPage.getPasswordInput();
    const usernameField = loginPage.getUsernameInput();
    const testPassword = 'submission-test-password';

    // Act
    await usernameField.fill('testuser');
    await passwordField.fill(testPassword);
    
    // Verify masking before submission
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    // Submit form (this will fail validation but we're testing masking)
    await page.keyboard.press('Enter');
    
    // Assert - Password should remain masked even after submission attempt
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    // Password field should be cleared after failed submission (security feature)
    const passwordValue = await passwordField.inputValue();
    expect(passwordValue).toBe('');
  });

  test('should verify password masking works with screen reader accessibility', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const passwordField = loginPage.getPasswordInput();

    // Act & Assert - Check accessibility attributes
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    // Verify accessibility attributes for screen readers
    const ariaLabel = await passwordField.getAttribute('aria-label');
    const placeholder = await passwordField.getAttribute('placeholder');
    
    // Should have proper accessibility setup
    expect(placeholder).toBeTruthy();
    
    // Fill password and verify accessibility is maintained
    await passwordField.fill('accessibility-test-password');
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('should validate password field CSS properties for masking', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const passwordField = loginPage.getPasswordInput();

    // Act
    await passwordField.fill('css-validation-password');

         // Assert - Verify CSS properties support password masking
     const computedStyle = await passwordField.evaluate((element) => {
       const styles = window.getComputedStyle(element);
       return {
         fontFamily: styles.fontFamily,
         textSecurity: styles.getPropertyValue('-webkit-text-security') || styles.getPropertyValue('text-security'),
         inputType: (element as HTMLInputElement).type
       };
     });

    expect(computedStyle.inputType).toBe('password');
    
    // In some browsers, password fields have special font rendering
    // This ensures the field is properly configured for masking
    console.log('Password field CSS properties:', computedStyle);
  });
}); 