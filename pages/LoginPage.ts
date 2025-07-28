import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly requiredFieldError: Locator;
  readonly usernameRequiredError: Locator;
  readonly passwordRequiredError: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginCard: Locator;
  readonly companyBranding: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text, div[role="alert"] p');
    this.requiredFieldError = page.locator('.oxd-text--span:has-text("Required"), span:has-text("Required")');
    this.usernameRequiredError = page.locator('input[name="username"] ~ .oxd-text--span:has-text("Required")');
    this.passwordRequiredError = page.locator('input[name="password"] ~ .oxd-text--span:has-text("Required")');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.loginCard = page.locator('.orangehrm-login-container');
    this.companyBranding = page.locator('.orangehrm-login-branding');
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateTo('/web/index.php/auth/login');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAndWaitForDashboard(username: string, password: string): Promise<void> {
    await this.login(username, password);
    // Wait for dashboard to load
    await this.page.waitForURL('**/dashboard/index');
    await this.waitForPageLoad();
  }

  async clearLoginForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return await this.errorMessage.textContent() || '';
    } catch {
      return '';
    }
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  async isRequiredFieldErrorVisible(): Promise<boolean> {
    return await this.isElementVisible(this.requiredFieldError);
  }

  async isUsernameRequiredErrorVisible(): Promise<boolean> {
    return await this.isElementVisible(this.usernameRequiredError);
  }

  async isPasswordRequiredErrorVisible(): Promise<boolean> {
    return await this.isElementVisible(this.passwordRequiredError);
  }

  async hasAnyValidationError(): Promise<boolean> {
    // Check for invalid credentials alert
    const hasAlert = await this.isErrorMessageVisible();
    // Check for required field errors using multiple selectors
    const hasRequired = await this.isRequiredFieldErrorVisible();
    
    // Additional check for any error text on the page
    const errorTexts = ['Required', 'Invalid credentials', 'invalid', 'error'];
    let hasErrorText = false;
    
    for (const errorText of errorTexts) {
      try {
        const errorLocator = this.page.locator(`text=${errorText}`).first();
        if (await errorLocator.isVisible({ timeout: 1000 })) {
          hasErrorText = true;
          break;
        }
      } catch {
        // Continue checking other error texts
      }
    }
    
    return hasAlert || hasRequired || hasErrorText;
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.loginCard);
  }

  async isPasswordMasked(): Promise<boolean> {
    const passwordType = await this.passwordInput.getAttribute('type');
    return passwordType === 'password';
  }

  async getPasswordFieldValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async waitForLoginError(): Promise<void> {
    await this.errorMessage.waitFor({ state: 'visible' });
  }
} 