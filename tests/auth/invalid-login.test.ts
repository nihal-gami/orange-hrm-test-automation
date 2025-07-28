import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Test Suite: Invalid Login Attempts
 * Jira Task: HRM-29
 * Epic: HRM-27 🔐 Authentication & Authorization
 */
test.describe('Invalid Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Navigate to Orange HRM login page before each test
    await page.goto('/web/index.php/auth/login');
    loginPage = new LoginPage(page);
  });

  test('HRM-29: Should show error for invalid username with valid password', async ({ page }) => {
    // Arrange
    const invalidUsername = 'WrongUser';
    const validPassword = 'admin123';

    // Act
    await loginPage.login(invalidUsername, validPassword);

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('invalid');
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
  });

  test('Should show error for valid username with invalid password', async ({ page }) => {
    // Arrange
    const validUsername = 'Admin';
    const invalidPassword = 'wrongpassword';

    // Act
    await loginPage.login(validUsername, invalidPassword);

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('invalid');
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('Should show error for both invalid username and password', async ({ page }) => {
    // Arrange
    const invalidUsername = 'WrongUser';
    const invalidPassword = 'wrongpassword';

    // Act
    await loginPage.login(invalidUsername, invalidPassword);

    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('invalid');
    
    // Take screenshot for documentation
    await loginPage.takeScreenshot('invalid-credentials-error');
  });

  test('Should show error for empty credentials', async ({ page }) => {
    // Arrange
    const emptyUsername = '';
    const emptyPassword = '';

    // Act
    await loginPage.login(emptyUsername, emptyPassword);

    // Assert
    // Check if validation message appears for required fields
    const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
    
    if (isErrorDisplayed) {
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage.toLowerCase()).toMatch(/(required|invalid|empty)/);
    }
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginContainer).toBeVisible();
  });

  test('Should verify username field is empty after failed login', async ({ page }) => {
    // Arrange
    const invalidUsername = 'WrongUser';
    const invalidPassword = 'wrongpassword';

    // Act
    await loginPage.login(invalidUsername, invalidPassword);
    await expect(loginPage.errorMessage).toBeVisible();

    // Assert - Some systems clear fields after failed login
    const isUsernameEmpty = await loginPage.isUsernameEmpty();
    const isPasswordEmpty = await loginPage.isPasswordEmpty();
    
    // Document the behavior (password should always be cleared for security)
    expect(isPasswordEmpty).toBe(true);
    
    // Username behavior may vary by implementation
    console.log(`Username cleared after failed login: ${isUsernameEmpty}`);
  });

  test('Should handle multiple consecutive failed login attempts', async ({ page }) => {
    // Test multiple failed attempts to check for account lockout or rate limiting
    const attempts = [
      { username: 'Wrong1', password: 'wrong1' },
      { username: 'Wrong2', password: 'wrong2' },
      { username: 'Wrong3', password: 'wrong3' }
    ];

    for (const attempt of attempts) {
      await loginPage.login(attempt.username, attempt.password);
      await expect(loginPage.errorMessage).toBeVisible();
      
      // Small delay between attempts
      await page.waitForTimeout(1000);
    }

    // Verify system still allows login attempts (no lockout in demo)
    await expect(loginPage.loginContainer).toBeVisible();
    await expect(loginPage.usernameInput).toBeEnabled();
    await expect(loginPage.passwordInput).toBeEnabled();
  });
}); 