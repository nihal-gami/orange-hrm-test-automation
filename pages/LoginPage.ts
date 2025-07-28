import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage class for Orange HRM login functionality
 * Implements Page Object Model pattern
 */
export class LoginPage extends BasePage {
  // Page elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginContainer: Locator;
  readonly forgotPasswordLink: Locator;
  readonly companyBranding: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.usernameInput = page.locator('[name="username"]');
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.locator('[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content');
    this.loginContainer = page.locator('.orangehrm-login-container');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot');
    this.companyBranding = page.locator('.orangehrm-login-branding');
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await super.goto('/web/index.php/auth/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  /**
   * Perform login with valid credentials (Admin/admin123)
   */
  async loginWithValidCredentials(): Promise<void> {
    await this.login('Admin', 'admin123');
  }

  /**
   * Check if login page is loaded
   */
  async isLoginPageLoaded(): Promise<boolean> {
    return await this.isVisible(this.loginContainer);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Verify password field is masked
   */
  async isPasswordFieldMasked(): Promise<boolean> {
    const passwordType = await this.passwordInput.getAttribute('type');
    return passwordType === 'password';
  }

  /**
   * Check if username field is empty
   */
  async isUsernameEmpty(): Promise<boolean> {
    const value = await this.usernameInput.inputValue();
    return value === '';
  }

  /**
   * Check if password field is empty
   */
  async isPasswordEmpty(): Promise<boolean> {
    const value = await this.passwordInput.inputValue();
    return value === '';
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  /**
   * Verify all login page elements are present
   */
  async verifyLoginPageElements(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.companyBranding).toBeVisible();
  }

  /**
   * Get login button text
   */
  async getLoginButtonText(): Promise<string> {
    return await this.getText(this.loginButton);
  }
} 