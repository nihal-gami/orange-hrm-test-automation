import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Test Suite: Password Field Masking Validation
 * Jira Task: HRM-30
 * Epic: HRM-27 🔐 Authentication & Authorization
 */
test.describe('Password Field Masking Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/web/index.php/auth/login');
    loginPage = new LoginPage(page);
  });

  test('HRM-30: Should verify password field has correct type attribute', async ({ page }) => {
    // Assert
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Verify using page object method
    const isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBe(true);
  });

  test('Should verify password characters are masked when typing', async ({ page }) => {
    // Arrange
    const testPassword = 'testPassword123!';

    // Act
    await loginPage.passwordInput.fill(testPassword);

    // Assert
    // Check that the input value is the password but display value is masked
    const inputValue = await loginPage.passwordInput.inputValue();
    expect(inputValue).toBe(testPassword);
    
    // Verify the field type remains password
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('Should verify password masking works with special characters', async ({ page }) => {
    // Arrange
    const specialPassword = '!@#$%^&*()_+{}|:<>?[]\\;\'\",./-=';

    // Act
    await loginPage.passwordInput.fill(specialPassword);

    // Assert
    const inputValue = await loginPage.passwordInput.inputValue();
    expect(inputValue).toBe(specialPassword);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('Should verify password field masking during login attempt', async ({ page }) => {
    // Arrange
    const username = 'Admin';
    const password = 'admin123';

    // Act
    await loginPage.usernameInput.fill(username);
    await loginPage.passwordInput.fill(password);

    // Assert password is still masked before submission
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Submit the form
    await loginPage.loginButton.click();
    
    // After form submission, password field should still be masked
    // (This checks behavior when staying on login page due to error)
    if (await loginPage.isLoginPageLoaded()) {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('Should verify password field masking with invalid credentials', async ({ page }) => {
    // Arrange
    const invalidUsername = 'WrongUser';
    const invalidPassword = 'wrongPassword123';

    // Act
    await loginPage.login(invalidUsername, invalidPassword);

    // Assert
    // Verify password field is still masked after failed login
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Verify error is shown (ensuring we're testing the right scenario)
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Should verify password field security in browser developer tools', async ({ page }) => {
    // Arrange
    const sensitivePassword = 'SuperSecret123!';

    // Act
    await loginPage.passwordInput.fill(sensitivePassword);

    // Assert - Check HTML structure doesn't expose password
    const passwordFieldHTML = await loginPage.passwordInput.innerHTML();
    expect(passwordFieldHTML).not.toContain(sensitivePassword);
    
    // Verify no sensitive data in page source
    const pageContent = await page.content();
    expect(pageContent).not.toContain(sensitivePassword);
    
    // Verify input type in DOM
    const inputType = await page.evaluate(() => {
      const passwordField = document.querySelector('[name="password"]') as HTMLInputElement;
      return passwordField?.type;
    });
    expect(inputType).toBe('password');
  });

  test('Should verify password masking works after page reload', async ({ page }) => {
    // Arrange
    const testPassword = 'testPassword';

    // Act
    await loginPage.passwordInput.fill(testPassword);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Re-initialize page object after reload
    loginPage = new LoginPage(page);

    // Assert
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Verify field is empty after reload (security measure)
    const inputValue = await loginPage.passwordInput.inputValue();
    expect(inputValue).toBe('');
  });

  test('Should verify password masking accessibility attributes', async ({ page }) => {
    // Assert accessibility attributes are present for password field
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Check for autocomplete attribute (should be disabled for security)
    const autocomplete = await loginPage.passwordInput.getAttribute('autocomplete');
    console.log(`Password field autocomplete attribute: ${autocomplete}`);
    
    // Verify field can be focused and is accessible
    await loginPage.passwordInput.focus();
    const isFocused = await loginPage.passwordInput.evaluate(el => document.activeElement === el);
    expect(isFocused).toBe(true);
  });
}); 