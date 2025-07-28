import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly loginForm: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[name="username"]');
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.locator('[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('text=Forgot your password?');
    this.loginForm = page.locator('.oxd-form');
    this.pageTitle = page.locator('h5');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
    await this.verifyLoginPageLoaded();
  }

  /**
   * Verify login page is loaded correctly
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await this.waitForElement(this.loginForm);
    await expect(this.pageTitle).toHaveText('Login');
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
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
   * Get username input element for validation
   */
  getUsernameInput(): Locator {
    return this.usernameInput;
  }

  /**
   * Get password input element for validation
   */
  getPasswordInput(): Locator {
    return this.passwordInput;
  }

  /**
   * Verify password field is masked
   */
  async verifyPasswordMasking(): Promise<void> {
    // Check input type is password
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
    
    // Fill password and verify it's not visible in plain text
    await this.fillInput(this.passwordInput, 'testpassword');
    const passwordValue = await this.passwordInput.getAttribute('value');
    
    // The actual value should be present but not visible due to masking
    await expect(this.passwordInput).toHaveValue('testpassword');
    
    // Check that the password field has proper styling for masking
    const inputType = await this.passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - Expected error message
   */
  async verifyErrorMessage(expectedMessage?: string): Promise<void> {
    await this.waitForElement(this.errorMessage);
    await expect(this.errorMessage).toBeVisible();
    
    if (expectedMessage) {
      await expect(this.errorMessage).toHaveText(expectedMessage);
    }
  }

  /**
   * Verify no error message is displayed
   */
  async verifyNoErrorMessage(): Promise<void> {
    const isErrorVisible = await this.isElementVisible(this.errorMessage);
    expect(isErrorVisible).toBe(false);
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
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
   * Get current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Verify still on login page (for negative test scenarios)
   */
  async verifyStillOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*\/web\/index\.php\/auth\/login/);
    await expect(this.pageTitle).toHaveText('Login');
  }
} 