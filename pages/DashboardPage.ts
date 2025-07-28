import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage class for Orange HRM dashboard functionality
 * Implements Page Object Model pattern
 */
export class DashboardPage extends BasePage {
  // Page elements
  readonly dashboardHeader: Locator;
  readonly userDropdown: Locator;
  readonly logoutOption: Locator;
  readonly mainMenu: Locator;
  readonly searchBox: Locator;
  readonly notifications: Locator;
  readonly userAvatar: Locator;
  readonly sideNavigation: Locator;
  readonly adminMenuItem: Locator;
  readonly pimMenuItem: Locator;
  readonly leaveMenuItem: Locator;
  readonly timeMenuItem: Locator;
  readonly recruitmentMenuItem: Locator;
  readonly myInfoMenuItem: Locator;
  readonly performanceMenuItem: Locator;
  readonly dashboardMenuItem: Locator;
  readonly directoryMenuItem: Locator;
  readonly maintenanceMenuItem: Locator;
  readonly claimMenuItem: Locator;
  readonly buzzMenuItem: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb');
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutOption = page.locator('.oxd-userdropdown-link', { hasText: 'Logout' });
    this.mainMenu = page.locator('.oxd-main-menu');
    this.searchBox = page.locator('[placeholder="Search"]');
    this.notifications = page.locator('.oxd-icon-button--success');
    this.userAvatar = page.locator('.oxd-userdropdown-img');
    this.sideNavigation = page.locator('.oxd-sidepanel');
    
    // Menu items - using more specific locators to avoid strict mode violations
    this.adminMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Admin' });
    this.pimMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'PIM' });
    this.leaveMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Leave' });
    this.timeMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Time' });
    this.recruitmentMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Recruitment' });
    this.myInfoMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'My Info' });
    this.performanceMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Performance' });
    this.dashboardMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Dashboard' });
    this.directoryMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Directory' });
    this.maintenanceMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Maintenance' });
    this.claimMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Claim' });
    this.buzzMenuItem = page.locator('.oxd-main-menu-item', { hasText: 'Buzz' });
  }

  /**
   * Check if dashboard page is loaded
   */
  async isDashboardLoaded(): Promise<boolean> {
    return await this.isVisible(this.dashboardHeader);
  }

  /**
   * Verify dashboard page elements are present
   */
  async verifyDashboardElements(): Promise<void> {
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.userDropdown).toBeVisible();
    await expect(this.sideNavigation).toBeVisible();
  }

  /**
   * Get dashboard title text
   */
  async getDashboardTitle(): Promise<string> {
    return await this.getText(this.dashboardHeader);
  }

  /**
   * Click user dropdown to open menu
   */
  async clickUserDropdown(): Promise<void> {
    await this.clickElement(this.userDropdown);
  }

  /**
   * Perform logout action
   */
  async logout(): Promise<void> {
    await this.clickUserDropdown();
    await this.waitForVisible(this.logoutOption);
    await this.clickElement(this.logoutOption);
  }

  /**
   * Navigate to Admin module
   */
  async navigateToAdmin(): Promise<void> {
    await this.clickElement(this.adminMenuItem);
  }

  /**
   * Navigate to PIM module
   */
  async navigateToPIM(): Promise<void> {
    await this.clickElement(this.pimMenuItem);
  }

  /**
   * Navigate to Leave module
   */
  async navigateToLeave(): Promise<void> {
    await this.clickElement(this.leaveMenuItem);
  }

  /**
   * Navigate to My Info
   */
  async navigateToMyInfo(): Promise<void> {
    await this.clickElement(this.myInfoMenuItem);
  }

  /**
   * Check if specific menu item is visible (for role-based testing)
   * @param menuItem - The menu item locator to check
   */
  async isMenuItemVisible(menuItem: Locator): Promise<boolean> {
    return await this.isVisible(menuItem);
  }

  /**
   * Verify admin role access - all menu items should be visible
   */
  async verifyAdminAccess(): Promise<void> {
    await expect(this.adminMenuItem).toBeVisible();
    await expect(this.pimMenuItem).toBeVisible();
    await expect(this.leaveMenuItem).toBeVisible();
    await expect(this.timeMenuItem).toBeVisible();
    await expect(this.recruitmentMenuItem).toBeVisible();
    await expect(this.performanceMenuItem).toBeVisible();
  }

  /**
   * Search for menu item or functionality
   * @param searchTerm - Term to search for
   */
  async searchInApplication(searchTerm: string): Promise<void> {
    await this.fillInput(this.searchBox, searchTerm);
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboardLoad(): Promise<void> {
    await this.waitForVisible(this.dashboardHeader);
    await this.waitForVisible(this.sideNavigation);
    await this.waitForPageLoad();
  }
} 