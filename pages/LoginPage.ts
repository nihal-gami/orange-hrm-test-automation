import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page class for Orange HRM authentication functionality
 * Covers all authentication test scenarios from Jira tasks
 */
export class LoginPage extends BasePage {
  // Page elements - using robust selectors
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly loginForm: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    // Robust selectors that are less likely to break
    this.usernameField = page.locator('[name="username"]');
    this.passwordField = page.locator('[name="password"]');
    this.loginButton = page.locator('[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.loginForm = page.locator('.oxd-form');
    this.pageTitle = page.locator('.oxd-text--h5');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForPageLoad();
    await this.verifyElementVisible(this.loginForm);
  }

  /**
   * Perform login with provided credentials
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.safeFill(this.usernameField, username);
    await this.safeFill(this.passwordField, password);
    await this.safeClick(this.loginButton);
  }

  /**
   * Enter username only
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.safeFill(this.usernameField, username);
  }

  /**
   * Enter password only
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.safeFill(this.passwordField, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.safeClick(this.loginButton);
  }

  /**
   * Verify login form is displayed
   */
  async verifyLoginFormDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.loginForm);
    await this.verifyElementVisible(this.usernameField);
    await this.verifyElementVisible(this.passwordField);
    await this.verifyElementVisible(this.loginButton);
  }

  /**
   * Verify error message is displayed
   * @param expectedMessage - Expected error message (optional)
   */
  async verifyErrorMessage(expectedMessage?: string): Promise<void> {
    await this.verifyElementVisible(this.errorMessage);
    if (expectedMessage) {
      await this.verifyTextContent(this.errorMessage, expectedMessage);
    }
  }

  /**
   * Verify password field is masked (type='password')
   */
  async verifyPasswordFieldMasked(): Promise<void> {
    const inputType = await this.passwordField.getAttribute('type');
    expect(inputType).toBe('password');
  }

  /**
   * Verify password field security attributes
   */
  async verifyPasswordFieldSecurity(): Promise<void> {
    // Check input type
    await this.verifyPasswordFieldMasked();
    
    // Check autocomplete attribute
    const autocomplete = await this.passwordField.getAttribute('autocomplete');
    expect(autocomplete).toBe('current-password');
    
    // Verify password is visually masked
    await this.passwordField.fill('testpassword');
    const value = await this.passwordField.inputValue();
    // The input value should still be the text, but it should be visually masked
    expect(value).toBe('testpassword');
    
    // Check that the field appears masked in the DOM
    const pseudoElementContent = await this.page.evaluate(() => {
      const field = document.querySelector('[name="password"]') as HTMLInputElement;
      return field ? window.getComputedStyle(field).getPropertyValue('-webkit-text-security') : null;
    });
    
    // Verify field is not readable via inspect element easily
    const isPasswordField = await this.passwordField.evaluate((el: HTMLInputElement) => {
      return el.type === 'password';
    });
    expect(isPasswordField).toBe(true);
  }

  /**
   * Test SQL injection in login fields
   * @param maliciousInput - SQL injection payload
   */
  async testSQLInjection(maliciousInput: string = "'; DROP TABLE users; --"): Promise<void> {
    await this.enterUsername(maliciousInput);
    await this.enterPassword(maliciousInput);
    await this.clickLogin();
    
    // Should not crash the application or show SQL errors
    // Should show normal login error
    await this.verifyErrorMessage();
  }

  /**
   * Test XSS in login fields
   * @param xssPayload - XSS payload
   */
  async testXSSInjection(xssPayload: string = '<script>alert("XSS")</script>'): Promise<void> {
    await this.enterUsername(xssPayload);
    await this.enterPassword(xssPayload);
    await this.clickLogin();
    
    // Should not execute script or show XSS behavior
    // Should show normal login error
    await this.verifyErrorMessage();
  }

  /**
   * Clear all form fields
   */
  async clearFields(): Promise<void> {
    await this.usernameField.clear();
    await this.passwordField.clear();
  }

  /**
   * Verify user remains on login page after failed attempt
   */
  async verifyStillOnLoginPage(): Promise<void> {
    await this.verifyElementVisible(this.loginForm);
    const currentUrl = await this.getCurrentUrl();
    expect(currentUrl).toContain('orangehrmlive.com');
    expect(currentUrl).not.toContain('dashboard');
  }

  /**
   * Get username field placeholder text
   */
  async getUsernamePlaceholder(): Promise<string | null> {
    return await this.usernameField.getAttribute('placeholder');
  }

  /**
   * Get password field placeholder text
   */
  async getPasswordPlaceholder(): Promise<string | null> {
    return await this.passwordField.getAttribute('placeholder');
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Verify forgot password link functionality
   */
  async verifyForgotPasswordLink(): Promise<void> {
    await this.verifyElementVisible(this.forgotPasswordLink);
  }
} 