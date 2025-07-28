import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page class for Orange HRM post-login functionality
 * Used to verify successful login and role-based access
 */
export class DashboardPage extends BasePage {
  // Page elements
  private readonly dashboardHeader: Locator;
  private readonly userDropdown: Locator;
  private readonly logoutButton: Locator;
  private readonly welcomeMessage: Locator;
  private readonly mainMenu: Locator;
  private readonly adminMenu: Locator;
  private readonly pimMenu: Locator;
  private readonly leaveMenu: Locator;
  private readonly timeMenu: Locator;
  private readonly recruitmentMenu: Locator;
  private readonly performanceMenu: Locator;
  private readonly dashboardBreadcrumb: Locator;
  private readonly sidePanel: Locator;

  constructor(page: Page) {
    super(page);
    // Dashboard elements
    this.dashboardHeader = page.locator('.oxd-topbar-header');
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutButton = page.locator('text=Logout');
    this.welcomeMessage = page.locator('.oxd-text--h6', { hasText: 'Dashboard' });
    this.mainMenu = page.locator('.oxd-main-menu').first();
    this.sidePanel = page.locator('.oxd-sidepanel');
    this.dashboardBreadcrumb = page.locator('.oxd-topbar-header-breadcrumb');
    
    // Menu items
    this.adminMenu = page.locator('.oxd-main-menu-item', { hasText: 'Admin' });
    this.pimMenu = page.locator('.oxd-main-menu-item', { hasText: 'PIM' });
    this.leaveMenu = page.locator('.oxd-main-menu-item', { hasText: 'Leave' });
    this.timeMenu = page.locator('.oxd-main-menu-item', { hasText: 'Time' });
    this.recruitmentMenu = page.locator('.oxd-main-menu-item', { hasText: 'Recruitment' });
    this.performanceMenu = page.locator('.oxd-main-menu-item', { hasText: 'Performance' });
  }

  /**
   * Verify user is on dashboard page after successful login
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.verifyElementVisible(this.dashboardHeader);
    await this.verifyElementVisible(this.dashboardBreadcrumb);
    await this.verifyElementVisible(this.mainMenu);
    
    // Verify URL contains dashboard
    const currentUrl = await this.getCurrentUrl();
    expect(currentUrl).toContain('dashboard');
  }

  /**
   * Verify dashboard title and breadcrumb
   */
  async verifyDashboardTitle(): Promise<void> {
    const title = await this.getPageTitle();
    expect(title).toContain('OrangeHRM');
    
    await this.verifyElementVisible(this.dashboardBreadcrumb);
  }

  /**
   * Verify main navigation menu is visible
   */
  async verifyMainMenuVisible(): Promise<void> {
    await this.verifyElementVisible(this.mainMenu);
    await this.verifyElementVisible(this.sidePanel);
  }

  /**
   * Get visible menu items (for role-based access testing)
   */
  async getVisibleMenuItems(): Promise<string[]> {
    const menuItems = await this.page.locator('.oxd-main-menu-item').allTextContents();
    return menuItems.filter(item => item.trim().length > 0);
  }

  /**
   * Verify Admin menu is visible (Admin role test)
   */
  async verifyAdminMenuVisible(): Promise<void> {
    await this.verifyElementVisible(this.adminMenu);
  }

  /**
   * Verify Admin menu is not visible (Non-admin role test)
   */
  async verifyAdminMenuNotVisible(): Promise<void> {
    await expect(this.adminMenu).not.toBeVisible();
  }

  /**
   * Navigate to Admin module
   */
  async navigateToAdmin(): Promise<void> {
    await this.safeClick(this.adminMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to PIM module
   */
  async navigateToPIM(): Promise<void> {
    await this.safeClick(this.pimMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Leave module
   */
  async navigateToLeave(): Promise<void> {
    await this.safeClick(this.leaveMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Time module
   */
  async navigateToTime(): Promise<void> {
    await this.safeClick(this.timeMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Recruitment module
   */
  async navigateToRecruitment(): Promise<void> {
    await this.safeClick(this.recruitmentMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Performance module
   */
  async navigateToPerformance(): Promise<void> {
    await this.safeClick(this.performanceMenu);
    await this.waitForPageLoad();
  }

  /**
   * Open user dropdown menu
   */
  async openUserDropdown(): Promise<void> {
    await this.safeClick(this.userDropdown);
    await this.verifyElementVisible(this.logoutButton);
  }

  /**
   * Perform logout
   */
  async logout(): Promise<void> {
    await this.openUserDropdown();
    await this.safeClick(this.logoutButton);
    await this.waitForPageLoad();
  }

  /**
   * Verify user can access specific module (for role testing)
   * @param moduleName - Name of the module to test
   */
  async verifyModuleAccess(moduleName: string): Promise<boolean> {
    try {
      const moduleLocator = this.page.locator('.oxd-main-menu-item', { hasText: moduleName });
      await this.verifyElementVisible(moduleLocator);
      await this.safeClick(moduleLocator);
      await this.waitForPageLoad();
      
      // Check if we're redirected to the module or get access denied
      const currentUrl = await this.getCurrentUrl();
      return currentUrl.toLowerCase().includes(moduleName.toLowerCase());
    } catch (error) {
      return false;
    }
  }

  /**
   * Test unauthorized access attempt
   * @param url - URL to test unauthorized access
   */
  async testUnauthorizedAccess(url: string): Promise<void> {
    await this.navigateTo(url);
    await this.waitForPageLoad();
    
    // Should either redirect to dashboard or show access denied
    const currentUrl = await this.getCurrentUrl();
    const isRedirected = currentUrl.includes('dashboard') || 
                        currentUrl.includes('login') || 
                        currentUrl.includes('unauthorized');
    
    expect(isRedirected).toBe(true);
  }

  /**
   * Verify session is active (user is still logged in)
   */
  async verifySessionActive(): Promise<void> {
    await this.verifyElementVisible(this.dashboardHeader);
    await this.verifyElementVisible(this.userDropdown);
    
    const currentUrl = await this.getCurrentUrl();
    expect(currentUrl).not.toContain('login');
  }

  /**
   * Test browser back button after logout
   */
  async testBackButtonAfterLogout(): Promise<void> {
    // Go back in browser history
    await this.page.goBack();
    await this.waitForPageLoad();
    
    // Should redirect to login page or show session expired
    const currentUrl = await this.getCurrentUrl();
    expect(currentUrl).toContain('login');
  }

  /**
   * Simulate session timeout and test redirect
   */
  async simulateSessionTimeout(): Promise<void> {
    // Clear session storage and cookies to simulate timeout
    await this.page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
    
    // Clear cookies
    const context = this.page.context();
    await context.clearCookies();
    
    // Try to perform an action that requires authentication
    await this.page.reload();
    await this.waitForPageLoad();
    
    // Should redirect to login page
    const currentUrl = await this.getCurrentUrl();
    expect(currentUrl).toContain('login');
  }

  /**
   * Check if user has access to all admin functions
   */
  async checkAdminAccess(): Promise<boolean> {
    try {
      await this.verifyAdminMenuVisible();
      await this.navigateToAdmin();
      
      // Check for admin-specific elements
      const adminElements = await this.page.locator('.oxd-topbar-header-breadcrumb').textContent();
      return adminElements?.includes('Admin') || false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user role information
   */
  async getCurrentUserRole(): Promise<string> {
    // This would need to be implemented based on how the application shows user role
    // For now, we'll determine based on menu visibility
    const visibleMenus = await this.getVisibleMenuItems();
    
    if (visibleMenus.includes('Admin')) {
      return 'Admin';
    } else if (visibleMenus.includes('PIM') && visibleMenus.includes('Leave')) {
      return 'Supervisor';
    } else {
      return 'ESS User';
    }
  }
} 