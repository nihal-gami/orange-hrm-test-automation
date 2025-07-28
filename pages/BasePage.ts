import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = 'https://opensource-demo.orangehrmlive.com';
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async goto(url: string = '') {
    await this.page.goto(`${this.baseURL}${url}`);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 15000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
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
   * Click element with retry mechanism
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  async clickElement(locator: Locator, timeout: number = 15000) {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.click();
  }

  /**
   * Fill text input with validation
   * @param locator - Input element locator
   * @param text - Text to fill
   * @param clear - Whether to clear the field first
   */
  async fillText(locator: Locator, text: string, clear: boolean = true) {
    await locator.waitFor({ state: 'visible' });
    if (clear) {
      await locator.clear();
    }
    await locator.fill(text);
  }

  /**
   * Get text content from element
   * @param locator - Element locator
   */
  async getTextContent(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  /**
   * Verify element contains expected text
   * @param locator - Element locator
   * @param expectedText - Expected text content
   */
  async verifyElementText(locator: Locator, expectedText: string) {
    await expect(locator).toContainText(expectedText);
  }

  /**
   * Verify element is visible
   * @param locator - Element locator
   */
  async verifyElementVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  /**
   * Verify element is hidden
   * @param locator - Element locator
   */
  async verifyElementHidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }
} 