import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Test Suite: Valid Login with Correct Credentials
 * Jira Task: HRM-28
 * Epic: HRM-27 🔐 Authentication & Authorization
 */
test.describe('Valid Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Orange HRM login page before each test
    await page.goto('/web/index.php/auth/login');
  });

  test('HRM-28: Should successfully login with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Act
    await loginPage.loginWithValidCredentials();
    
    // Assert
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/.*dashboard/);
    await dashboardPage.verifyDashboardElements();
    
    // Verify dashboard title contains expected text
    const dashboardTitle = await dashboardPage.getDashboardTitle();
    expect(dashboardTitle).toContain('Dashboard');
    
    // Take screenshot for documentation
    await dashboardPage.takeScreenshot('valid-login-success');
  });

  test('Should verify login page elements are present', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act & Assert
    await loginPage.verifyLoginPageElements();
    
    // Verify page title
    const title = await loginPage.getTitle();
    expect(title).toContain('OrangeHRM');
    
    // Verify login button text
    const buttonText = await loginPage.getLoginButtonText();
    expect(buttonText.toLowerCase()).toContain('login');
  });

  test('Should verify password field is properly masked', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act & Assert
    const isPasswordMasked = await loginPage.isPasswordFieldMasked();
    expect(isPasswordMasked).toBe(true);
    
    // Verify password field type attribute
    const passwordField = loginPage.passwordInput;
    await expect(passwordField).toHaveAttribute('type', 'password');
  });
}); 