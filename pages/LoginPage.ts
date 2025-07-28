import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Page elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginContainer: Locator;
  readonly forgotPasswordLink: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.usernameInput = page.locator('[name="username"]');
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.locator('[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.loginContainer = page.locator('.oxd-sheet');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.pageTitle = page.locator('.oxd-text--h5');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/web/index.php/auth/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   * @param username - Username to login with
   * @param password - Password to login with
   */
  async login(username: string, password: string) {
    try {
      await this.fillText(this.usernameInput, username);
      await this.fillText(this.passwordInput, password);
      await this.clickElement(this.loginButton);
      
      // Wait for navigation or error message
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Perform valid login with Admin credentials
   */
  async loginAsAdmin() {
    await this.login('Admin', 'admin123');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.getTextContent(this.errorMessage);
    } catch {
      return '';
    }
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPageLoaded() {
    await this.verifyElementVisible(this.loginContainer);
    await this.verifyElementVisible(this.usernameInput);
    await this.verifyElementVisible(this.passwordInput);
    await this.verifyElementVisible(this.loginButton);
  }

  /**
   * Get username input placeholder
   */
  async getUsernamePlaceholder(): Promise<string> {
    return await this.usernameInput.getAttribute('placeholder') || '';
  }

  /**
   * Get password input type attribute
   */
  async getPasswordInputType(): Promise<string> {
    return await this.passwordInput.getAttribute('type') || '';
  }

  /**
   * Verify password field is masked
   */
  async verifyPasswordFieldMasked() {
    const inputType = await this.getPasswordInputType();
    if (inputType !== 'password') {
      throw new Error(`Expected password field type to be 'password', but got '${inputType}'`);
    }
  }

  /**
   * Clear login form
   */
  async clearForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Get page title text
   */
  async getPageTitleText(): Promise<string> {
    try {
      return await this.getTextContent(this.pageTitle);
    } catch {
      return '';
    }
  }
} 