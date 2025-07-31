import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage class for Orange HRM login functionality
 * Implements Page Object Model pattern for maintainable test code
 */
export class LoginPage extends BasePage {
  // Page locators
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly orangeHrmLogo: Locator;
  readonly loginFormContainer: Locator;
  readonly credentialsContainer: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.usernameField = page.locator('[name="username"]');
    this.passwordField = page.locator('[name="password"]');
    this.loginButton = page.locator('[type="submit"]');
    this.errorMessage = page.locator('div[role="alert"] p, .oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.orangeHrmLogo = page.locator('.orangehrm-login-branding img');
    this.loginFormContainer = page.locator('.orangehrm-login-form');
    this.credentialsContainer = page.locator('.orangehrm-demo-credentials');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.goto('/web/index.php/auth/login');
    await this.waitForPageLoad();
  }

  /**
   * Enter username
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillText(this.usernameField, username);
  }

  /**
   * Enter password
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillText(this.passwordField, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Complete login process with credentials
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Get error message text
   * @returns Promise<string> - Error message
   */
  async getErrorMessage(): Promise<string> {
    try {
      await this.waitForElement(this.errorMessage, 5000);
      return await this.getTextContent(this.errorMessage);
    } catch {
      return '';
    }
  }

  /**
   * Check if error message is displayed
   * @returns Promise<boolean> - Error message visibility
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Verify password field is masked
   * @returns Promise<boolean> - Password masking status
   */
  async isPasswordFieldMasked(): Promise<boolean> {
    const inputType = await this.passwordField.getAttribute('type');
    return inputType === 'password';
  }

  /**
   * Get password field value (should be empty for security)
   * @returns Promise<string> - Password field value
   */
  async getPasswordFieldValue(): Promise<string> {
    return await this.passwordField.inputValue();
  }

  /**
   * Verify login form is displayed
   */
  async verifyLoginFormDisplayed(): Promise<void> {
    await expect(this.loginFormContainer).toBeVisible();
    await expect(this.usernameField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Verify Orange HRM logo is displayed
   */
  async verifyOrangeHrmLogo(): Promise<void> {
    await expect(this.orangeHrmLogo).toBeVisible();
  }

  /**
   * Clear username field
   */
  async clearUsername(): Promise<void> {
    await this.usernameField.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    await this.passwordField.clear();
  }

  /**
   * Clear all login fields
   */
  async clearAllFields(): Promise<void> {
    await this.clearUsername();
    await this.clearPassword();
  }

  /**
   * Verify login page title
   */
  async verifyLoginPageTitle(): Promise<void> {
    await this.verifyPageTitle('OrangeHRM');
  }

  /**
   * Check if username field is focused
   * @returns Promise<boolean> - Focus status
   */
  async isUsernameFieldFocused(): Promise<boolean> {
    return await this.usernameField.evaluate(element => document.activeElement === element);
  }

  /**
   * Get placeholder text for username field
   * @returns Promise<string> - Placeholder text
   */
  async getUsernamePlaceholder(): Promise<string> {
    return await this.usernameField.getAttribute('placeholder') || '';
  }

  /**
   * Get placeholder text for password field
   * @returns Promise<string> - Placeholder text
   */
  async getPasswordPlaceholder(): Promise<string> {
    return await this.passwordField.getAttribute('placeholder') || '';
  }

  /**
   * Verify credentials container is displayed (demo credentials)
   */
  async verifyCredentialsContainer(): Promise<void> {
    await expect(this.credentialsContainer).toBeVisible();
  }
} 