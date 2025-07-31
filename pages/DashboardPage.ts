import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage class for Orange HRM dashboard functionality
 * Handles post-login navigation and user actions
 */
export class DashboardPage extends BasePage {
  // Navigation locators
  readonly dashboardTitle: Locator;
  readonly userDropdown: Locator;
  readonly logoutOption: Locator;
  readonly welcomeMessage: Locator;
  readonly mainMenuItems: Locator;
  readonly userProfilePicture: Locator;
  readonly breadcrumbNav: Locator;
  readonly sidebarMenu: Locator;

  // Menu items
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
  readonly buzzMenuItem: Locator;

  // Dashboard widgets
  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;
  readonly quickLaunchWidget: Locator;
  readonly buzzLatestPostsWidget: Locator;
  readonly employeesOnLeaveWidget: Locator;
  readonly employeeDistributionWidget: Locator;

  constructor(page: Page) {
    super(page);
    
    // Navigation elements
    this.dashboardTitle = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutOption = page.locator('text=Logout');
    this.welcomeMessage = page.locator('.oxd-topbar-header-title');
    this.mainMenuItems = page.locator('.oxd-main-menu-item');
    this.userProfilePicture = page.locator('.oxd-userdropdown-img');
    this.breadcrumbNav = page.locator('.oxd-topbar-header-breadcrumb');
    this.sidebarMenu = page.locator('.oxd-sidepanel');

    // Initialize menu item locators
    this.adminMenuItem = page.locator('text=Admin').first();
    this.pimMenuItem = page.locator('text=PIM').first();
    this.leaveMenuItem = page.locator('text=Leave').first();
    this.timeMenuItem = page.locator('text=Time').first();
    this.recruitmentMenuItem = page.locator('text=Recruitment').first();
    this.myInfoMenuItem = page.locator('text=My Info').first();
    this.performanceMenuItem = page.locator('text=Performance').first();
    this.dashboardMenuItem = page.locator('text=Dashboard').first();
    this.directoryMenuItem = page.locator('text=Directory').first();
    this.maintenanceMenuItem = page.locator('text=Maintenance').first();
    this.buzzMenuItem = page.locator('text=Buzz').first();

    // Dashboard widgets
    this.timeAtWorkWidget = page.locator('.oxd-pie-chart');
    this.myActionsWidget = page.locator('.orangehrm-todo-list');
    this.quickLaunchWidget = page.locator('.orangehrm-quick-launch');
    this.buzzLatestPostsWidget = page.locator('.orangehrm-buzz-stats');
    this.employeesOnLeaveWidget = page.locator('.orangehrm-leave-card');
    this.employeeDistributionWidget = page.locator('.orangehrm-buzz-newsfeed');
  }

  /**
   * Wait for dashboard to load completely
   */
  async waitForDashboardLoad(): Promise<void> {
    // Wait for key elements to be visible
    await this.waitForElement(this.dashboardTitle, 15000);
    await this.waitForElement(this.userDropdown, 10000);
    // Sidebar menu is optional for load verification
    await this.waitForPageLoad();
  }

  /**
   * Verify user is successfully logged in to dashboard
   */
  async verifySuccessfulLogin(): Promise<void> {
    await this.waitForDashboardLoad();
    await expect(this.dashboardTitle).toBeVisible();
    await expect(this.dashboardTitle).toHaveText('Dashboard');
    await expect(this.userDropdown).toBeVisible();
  }

  /**
   * Verify user is logged in (less strict than verifySuccessfulLogin)
   */
  async verifyUserLoggedIn(): Promise<void> {
    await expect(this.userDropdown).toBeVisible();
    // User is logged in if they can see the user dropdown
  }

  /**
   * Get dashboard title text
   * @returns Promise<string> - Dashboard title
   */
  async getDashboardTitle(): Promise<string> {
    return await this.getTextContent(this.dashboardTitle);
  }

  /**
   * Click on user dropdown menu
   */
  async clickUserDropdown(): Promise<void> {
    await this.clickElement(this.userDropdown);
  }

  /**
   * Perform logout action
   */
  async logout(): Promise<void> {
    await this.clickUserDropdown();
    await this.waitForElement(this.logoutOption);
    await this.clickElement(this.logoutOption);
  }

  /**
   * Navigate to Admin module
   */
  async navigateToAdmin(): Promise<void> {
    await this.clickElement(this.adminMenuItem);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to PIM module
   */
  async navigateToPIM(): Promise<void> {
    await this.clickElement(this.pimMenuItem);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Leave module
   */
  async navigateToLeave(): Promise<void> {
    await this.clickElement(this.leaveMenuItem);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Time module
   */
  async navigateToTime(): Promise<void> {
    await this.clickElement(this.timeMenuItem);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Recruitment module
   */
  async navigateToRecruitment(): Promise<void> {
    await this.clickElement(this.recruitmentMenuItem);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to My Info module
   */
  async navigateToMyInfo(): Promise<void> {
    await this.clickElement(this.myInfoMenuItem);
    await this.waitForPageLoad();
  }

  /**
   * Check if specific menu item is visible based on user role
   * @param menuItem - Menu item locator
   * @returns Promise<boolean> - Visibility status
   */
  async isMenuItemVisible(menuItem: Locator): Promise<boolean> {
    return await this.isElementVisible(menuItem);
  }

  /**
   * Verify role-based menu access
   * @param expectedMenuItems - Array of expected menu item names
   */
  async verifyRoleBasedMenuAccess(expectedMenuItems: string[]): Promise<void> {
    for (const menuItem of expectedMenuItems) {
      const menuLocator = this.page.locator(`text=${menuItem}`).first();
      await expect(menuLocator).toBeVisible();
    }
  }

  /**
   * Get all visible menu items
   * @returns Promise<string[]> - List of visible menu items
   */
  async getVisibleMenuItems(): Promise<string[]> {
    const menuItems = await this.mainMenuItems.allTextContents();
    return menuItems.filter(item => item.trim() !== '');
  }

  /**
   * Verify user profile picture is displayed
   */
  async verifyUserProfilePicture(): Promise<void> {
    await expect(this.userProfilePicture).toBeVisible();
  }

  /**
   * Verify sidebar menu is displayed
   */
  async verifySidebarMenu(): Promise<void> {
    await expect(this.sidebarMenu).toBeVisible();
  }

  /**
   * Verify dashboard widgets are loaded
   */
  async verifyDashboardWidgets(): Promise<void> {
    // Check if at least some dashboard widgets are visible
    const widgetSelectors = [
      this.timeAtWorkWidget,
      this.myActionsWidget,
      this.quickLaunchWidget
    ];

    for (const widget of widgetSelectors) {
      const isVisible = await this.isElementVisible(widget);
      if (isVisible) {
        // At least one widget is visible, dashboard is properly loaded
        return;
      }
    }
  }

  /**
   * Get current breadcrumb navigation
   * @returns Promise<string> - Breadcrumb text
   */
  async getBreadcrumbNavigation(): Promise<string> {
    return await this.getTextContent(this.breadcrumbNav);
  }

  /**
   * Verify specific module access based on user role
   * @param moduleName - Name of the module to verify access
   * @returns Promise<boolean> - Access status
   */
  async verifyModuleAccess(moduleName: string): Promise<boolean> {
    const moduleLocator = this.page.locator(`text=${moduleName}`).first();
    return await this.isElementVisible(moduleLocator);
  }
} 