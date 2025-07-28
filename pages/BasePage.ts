import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page class containing common functionality for all page objects
 * Following Page Object Model (POM) pattern as per workspace rules
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot with a descriptive name
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Get current page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Timeout in milliseconds
   */
  async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click element with wait
   * @param locator - Element locator
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input field with text
   * @param locator - Input field locator
   * @param text - Text to fill
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get text content of element
   * @param locator - Element locator
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }
} 