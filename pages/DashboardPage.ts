import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly dashboardHeader: Locator;
  readonly userDropdown: Locator;
  readonly logoutOption: Locator;
  readonly sideMenu: Locator;
  readonly adminMenuItem: Locator;
  readonly pimMenuItem: Locator;
  readonly leaveMenuItem: Locator;
  readonly timeMenuItem: Locator;
  readonly recruitmentMenuItem: Locator;
  readonly performanceMenuItem: Locator;
  readonly directoryMenuItem: Locator;
  readonly maintenanceMenuItem: Locator;
  readonly claimMenuItem: Locator;
  readonly buzzMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutOption = page.locator('text=Logout');
    this.sideMenu = page.locator('.oxd-sidepanel');
    
    // Main menu items
    this.adminMenuItem = page.locator('a[href*="/admin"], .oxd-main-menu-item:has-text("Admin")');
    this.pimMenuItem = page.locator('a[href*="/pim"], .oxd-main-menu-item:has-text("PIM")');
    this.leaveMenuItem = page.locator('a[href*="/leave"], .oxd-main-menu-item:has-text("Leave")');
    this.timeMenuItem = page.locator('a[href*="/time"], .oxd-main-menu-item:has-text("Time")');
    this.recruitmentMenuItem = page.locator('a[href*="/recruitment"], .oxd-main-menu-item:has-text("Recruitment")');
    this.performanceMenuItem = page.locator('a[href*="/performance"], .oxd-main-menu-item:has-text("Performance")');
    this.directoryMenuItem = page.locator('a[href*="/directory"], .oxd-main-menu-item:has-text("Directory")');
    this.maintenanceMenuItem = page.locator('a[href*="/maintenance"], .oxd-main-menu-item:has-text("Maintenance")');
    this.claimMenuItem = page.locator('a[href*="/claim"], .oxd-main-menu-item:has-text("Claim")');
    this.buzzMenuItem = page.locator('a[href*="/buzz"], .oxd-main-menu-item:has-text("Buzz")');
  }

  async waitForDashboardLoad(): Promise<void> {
    await this.dashboardHeader.waitFor({ state: 'visible' });
    await this.waitForPageLoad();
  }

  async isDashboardVisible(): Promise<boolean> {
    return await this.isElementVisible(this.dashboardHeader);
  }

  async getDashboardTitle(): Promise<string> {
    return await this.dashboardHeader.textContent() || '';
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutOption.click();
    await this.page.waitForURL('**/auth/login');
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.userDropdown);
  }

  async navigateToAdmin(): Promise<void> {
    await this.adminMenuItem.click();
    await this.page.waitForURL('**/admin/**');
  }

  async navigateToPIM(): Promise<void> {
    await this.pimMenuItem.click();
    await this.page.waitForURL('**/pim/**');
  }

  async navigateToLeave(): Promise<void> {
    await this.leaveMenuItem.click();
    await this.page.waitForURL('**/leave/**');
  }

  async isMenuItemVisible(menuItem: Locator): Promise<boolean> {
    return await this.isElementVisible(menuItem);
  }

  async getVisibleMenuItems(): Promise<string[]> {
    const menuItems = [
      { locator: this.adminMenuItem, name: 'Admin' },
      { locator: this.pimMenuItem, name: 'PIM' },
      { locator: this.leaveMenuItem, name: 'Leave' },
      { locator: this.timeMenuItem, name: 'Time' },
      { locator: this.recruitmentMenuItem, name: 'Recruitment' },
      { locator: this.performanceMenuItem, name: 'Performance' },
      { locator: this.directoryMenuItem, name: 'Directory' },
      { locator: this.maintenanceMenuItem, name: 'Maintenance' },
      { locator: this.claimMenuItem, name: 'Claim' },
      { locator: this.buzzMenuItem, name: 'Buzz' }
    ];

    const visibleItems: string[] = [];
    for (const item of menuItems) {
      if (await this.isMenuItemVisible(item.locator)) {
        visibleItems.push(item.name);
      }
    }
    return visibleItems;
  }
} 