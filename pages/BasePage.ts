import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page class containing common functionality for all page objects
 * Following Page Object Model (POM) pattern as per automation rules
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - URL to navigate to
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Get the current page title
   * @returns Promise<string> - Page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current URL
   * @returns Promise<string> - Current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for a specific element to be visible
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click on an element with dynamic wait
   * @param locator - Element locator
   */
  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill text in an input field
   * @param locator - Input field locator
   * @param text - Text to fill
   */
  async fillText(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get text content from an element
   * @param locator - Element locator
   * @returns Promise<string> - Text content
   */
  async getTextContent(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
   * @returns Promise<boolean> - Visibility status
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Take a screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify page title
   * @param expectedTitle - Expected page title
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify URL contains specific text
   * @param expectedUrlPart - Expected URL part
   */
  async verifyUrlContains(expectedUrlPart: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedUrlPart));
  }
} 