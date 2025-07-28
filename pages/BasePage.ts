import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = 'https://opensource-demo.orangehrmlive.com/';
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async navigate(url: string = ''): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    await this.page.goto(fullUrl, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for an element to be visible
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click an element with retry mechanism
   * @param locator - The element locator
   */
  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill input field with retry mechanism
   * @param locator - The input field locator
   * @param text - Text to fill
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get text content of an element
   * @param locator - The element locator
   * @returns Promise<string>
   */
  async getTextContent(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    const text = await locator.textContent();
    return text || '';
  }

  /**
   * Check if element is visible
   * @param locator - The element locator
   * @returns Promise<boolean>
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify page title
   * @param expectedTitle - Expected page title
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify URL contains expected text
   * @param expectedUrlPart - Expected URL part
   */
  async verifyUrl(expectedUrlPart: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrlPart));
  }

  /**
   * Take screenshot for debugging
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
} 