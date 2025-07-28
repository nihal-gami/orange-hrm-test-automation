import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Page elements
  readonly dashboardHeader: Locator;
  readonly userDropdown: Locator;
  readonly logoutOption: Locator;
  readonly mainMenu: Locator;
  readonly dashboardContent: Locator;
  readonly breadcrumb: Locator;
  readonly userProfilePicture: Locator;
  readonly sideMenu: Locator;

  // Menu items
  readonly adminMenu: Locator;
  readonly pimMenu: Locator;
  readonly leaveMenu: Locator;
  readonly timeMenu: Locator;
  readonly recruitmentMenu: Locator;
  readonly performanceMenu: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize main page locators
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutOption = page.locator('text=Logout');
    this.mainMenu = page.locator('.oxd-main-menu').first();
    this.dashboardContent = page.locator('.oxd-layout-body');
    this.breadcrumb = page.locator('.oxd-breadcrumb');
    this.userProfilePicture = page.locator('.oxd-userdropdown-img');
    this.sideMenu = page.locator('.oxd-sidepanel');

    // Initialize menu item locators
    this.adminMenu = page.locator('text=Admin').first();
    this.pimMenu = page.locator('text=PIM').first();
    this.leaveMenu = page.locator('text=Leave').first();
    this.timeMenu = page.locator('text=Time').first();
    this.recruitmentMenu = page.locator('text=Recruitment').first();
    this.performanceMenu = page.locator('text=Performance').first();
  }

  /**
   * Verify dashboard page is loaded
   */
  async verifyDashboardLoaded() {
    await this.verifyElementVisible(this.dashboardHeader);
    await this.verifyElementVisible(this.userDropdown);
    await this.verifyElementVisible(this.mainMenu);
  }

  /**
   * Get dashboard page title
   */
  async getDashboardTitle(): Promise<string> {
    return await this.getTextContent(this.dashboardHeader);
  }

  /**
   * Perform logout
   */
  async logout() {
    try {
      await this.clickElement(this.userDropdown);
      await this.waitForElement(this.logoutOption);
      await this.clickElement(this.logoutOption);
      
      // Wait for redirect to login page
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Navigate to Admin module
   */
  async navigateToAdmin() {
    await this.clickElement(this.adminMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to PIM module
   */
  async navigateToPIM() {
    await this.clickElement(this.pimMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Leave module
   */
  async navigateToLeave() {
    await this.clickElement(this.leaveMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Time module
   */
  async navigateToTime() {
    await this.clickElement(this.timeMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Recruitment module
   */
  async navigateToRecruitment() {
    await this.clickElement(this.recruitmentMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Performance module
   */
  async navigateToPerformance() {
    await this.clickElement(this.performanceMenu);
    await this.waitForPageLoad();
  }

  /**
   * Check if specific menu item is visible
   * @param menuName - Name of the menu item
   */
  async isMenuItemVisible(menuName: string): Promise<boolean> {
    const menuItem = this.page.locator(`text=${menuName}`).first();
    return await this.isElementVisible(menuItem);
  }

  /**
   * Get all visible menu items
   */
  async getVisibleMenuItems(): Promise<string[]> {
    await this.waitForElement(this.mainMenu);
    const menuItems = await this.mainMenu.locator('.oxd-main-menu-item').all();
    const visibleItems: string[] = [];
    
    for (const item of menuItems) {
      if (await item.isVisible()) {
        const text = await item.textContent();
        if (text) {
          visibleItems.push(text.trim());
        }
      }
    }
    
    return visibleItems;
  }

  /**
   * Verify user has admin access (all menu items visible)
   */
  async verifyAdminAccess() {
    const expectedMenuItems = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'Performance'];
    
    for (const menuItem of expectedMenuItems) {
      const isVisible = await this.isMenuItemVisible(menuItem);
      if (!isVisible) {
        throw new Error(`Menu item '${menuItem}' is not visible for admin user`);
      }
    }
  }

  /**
   * Get breadcrumb text
   */
  async getBreadcrumbText(): Promise<string> {
    try {
      return await this.getTextContent(this.breadcrumb);
    } catch {
      return '';
    }
  }

  /**
   * Verify dashboard content is loaded
   */
  async verifyDashboardContent() {
    await this.verifyElementVisible(this.dashboardContent);
  }

  /**
   * Check if user is logged in
   */
  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.userDropdown);
  }
} 