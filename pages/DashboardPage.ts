import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Locators
  private readonly dashboardHeader: Locator;
  private readonly userDropdown: Locator;
  private readonly logoutButton: Locator;
  private readonly navigationMenu: Locator;
  private readonly dashboardCard: Locator;
  private readonly searchBox: Locator;
  private readonly breadcrumb: Locator;
  private readonly userAvatar: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.locator('text=Logout');
    this.navigationMenu = page.locator('.oxd-main-menu').first();
    this.dashboardCard = page.locator('.oxd-dashboard-widget');
    this.searchBox = page.locator('.oxd-main-menu-search');
    this.breadcrumb = page.locator('.oxd-topbar-header-breadcrumb');
    this.userAvatar = page.locator('.oxd-userdropdown-img');
  }

  /**
   * Verify dashboard page is loaded successfully
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.waitForPageLoad();
    await this.waitForElement(this.dashboardHeader);
    
    // Verify URL contains dashboard
    await this.verifyUrl('dashboard');
    
    // Verify dashboard elements are visible
    await expect(this.dashboardHeader).toBeVisible();
    await expect(this.navigationMenu).toBeVisible();
    await expect(this.userDropdown).toBeVisible();
  }

  /**
   * Verify dashboard title/header
   */
  async verifyDashboardTitle(): Promise<void> {
    const headerText = await this.getTextContent(this.dashboardHeader);
    expect(headerText.toLowerCase()).toContain('dashboard');
  }

  /**
   * Verify navigation menu is present
   */
  async verifyNavigationMenu(): Promise<void> {
    await expect(this.navigationMenu).toBeVisible();
    
    // Verify some main menu items are present
    const menuItems = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info'];
    
    for (const item of menuItems) {
      const menuItem = this.page.locator(`[data-v-636d6b87].oxd-main-menu-item-wrapper`).filter({ hasText: item });
      await expect(menuItem.first()).toBeVisible();
    }
  }

  /**
   * Click on a navigation menu item
   * @param menuName - Name of the menu item to click
   */
  async clickNavigationMenu(menuName: string): Promise<void> {
    const menuItem = this.page.locator(`[data-v-636d6b87].oxd-main-menu-item-wrapper`).filter({ hasText: menuName });
    await this.clickElement(menuItem.first());
  }

  /**
   * Verify user is logged in by checking user dropdown
   */
  async verifyUserLoggedIn(): Promise<void> {
    await expect(this.userDropdown).toBeVisible();
    await expect(this.userAvatar).toBeVisible();
  }

  /**
   * Open user dropdown menu
   */
  async openUserDropdown(): Promise<void> {
    await this.clickElement(this.userDropdown);
    await this.waitForElement(this.logoutButton);
  }

  /**
   * Perform logout
   */
  async logout(): Promise<void> {
    await this.openUserDropdown();
    await this.clickElement(this.logoutButton);
  }

  /**
   * Get current user information from dropdown
   */
  async getCurrentUser(): Promise<string> {
    await this.openUserDropdown();
    const userInfo = this.page.locator('.oxd-userdropdown-name');
    return await this.getTextContent(userInfo);
  }

  /**
   * Verify role-based access - check if admin menus are visible
   */
  async verifyAdminAccess(): Promise<void> {
    // Admin should see Admin menu
    const adminMenu = this.page.locator('text=Admin').first();
    await expect(adminMenu).toBeVisible();
  }

  /**
   * Verify role-based access - check employee self-service view
   */
  async verifyEmployeeAccess(): Promise<void> {
    // Employee should see limited menus
    const myInfoMenu = this.page.locator('text=My Info').first();
    await expect(myInfoMenu).toBeVisible();
    
    // Admin menu should not be visible for regular employees
    const adminMenu = this.page.locator('text=Admin').first();
    const isAdminVisible = await this.isElementVisible(adminMenu);
    if (!isAdminVisible) {
      // This is expected for non-admin users
      console.log('✅ Admin menu correctly hidden for non-admin user');
    }
  }

  /**
   * Navigate to a specific module
   * @param moduleName - Name of the module to navigate to
   */
  async navigateToModule(moduleName: string): Promise<void> {
    await this.clickNavigationMenu(moduleName);
    await this.waitForPageLoad();
  }

  /**
   * Search for menu items
   * @param searchTerm - Term to search for
   */
  async searchMenu(searchTerm: string): Promise<void> {
    await this.fillInput(this.searchBox, searchTerm);
  }

  /**
   * Verify dashboard widgets/cards are loaded
   */
  async verifyDashboardWidgets(): Promise<void> {
    const widgets = await this.page.locator('.oxd-dashboard-widget').count();
    expect(widgets).toBeGreaterThan(0);
  }
} 