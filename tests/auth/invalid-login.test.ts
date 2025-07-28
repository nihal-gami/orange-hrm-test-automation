import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { testData } from '../data/auth-test-data';

/**
 * Test Suite: Invalid Login Tests - Multiple Scenarios
 * Related Jira Task: HRM-36
 * Epic: HRM-34 Authentication & Authorization
 * 
 * Covers various invalid login scenarios including security testing
 */
test.describe('Invalid Login - Multiple Scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('HRM-36: Should reject invalid username with valid password', async ({ page }) => {
    await test.step('Enter invalid username with valid password', async () => {
      await loginPage.login('InvalidUser', 'admin123');
    });

    await test.step('Verify error message and remain on login page', async () => {
      await loginPage.verifyErrorMessage();
      await loginPage.verifyStillOnLoginPage();
    });

    await test.step('Take screenshot of error state', async () => {
      await page.screenshot({ 
        path: 'test-results/screenshots/invalid-username-error.png' 
      });
    });
  });

  test('HRM-36: Should reject valid username with invalid password', async ({ page }) => {
    await test.step('Enter valid username with invalid password', async () => {
      await loginPage.login('Admin', 'wrongpassword');
    });

    await test.step('Verify error message and remain on login page', async () => {
      await loginPage.verifyErrorMessage();
      await loginPage.verifyStillOnLoginPage();
    });
  });

  test('HRM-36: Should reject both invalid username and password', async ({ page }) => {
    await test.step('Enter both invalid credentials', async () => {
      await loginPage.login('InvalidUser', 'wrongpassword');
    });

    await test.step('Verify error message and remain on login page', async () => {
      await loginPage.verifyErrorMessage();
      await loginPage.verifyStillOnLoginPage();
    });
  });

  test('HRM-36: Should handle empty username field', async ({ page }) => {
    await test.step('Leave username empty and enter password', async () => {
      await loginPage.enterPassword('admin123');
      await loginPage.clickLogin();
    });

    await test.step('Verify validation error for empty username', async () => {
      // Should show field validation error or general error
      const isLoginButtonEnabled = await loginPage.isLoginButtonEnabled();
      if (isLoginButtonEnabled) {
        await loginPage.verifyErrorMessage();
      }
      await loginPage.verifyStillOnLoginPage();
    });
  });

  test('HRM-36: Should handle empty password field', async ({ page }) => {
    await test.step('Enter username and leave password empty', async () => {
      await loginPage.enterUsername('Admin');
      await loginPage.clickLogin();
    });

    await test.step('Verify validation error for empty password', async () => {
      const isLoginButtonEnabled = await loginPage.isLoginButtonEnabled();
      if (isLoginButtonEnabled) {
        await loginPage.verifyErrorMessage();
      }
      await loginPage.verifyStillOnLoginPage();
    });
  });

  test('HRM-36: Should handle both empty fields', async ({ page }) => {
    await test.step('Click login with both fields empty', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Verify validation errors', async () => {
      // Check if login button is disabled or shows validation errors
      const isLoginButtonEnabled = await loginPage.isLoginButtonEnabled();
      if (isLoginButtonEnabled) {
        await loginPage.verifyErrorMessage();
      }
      await loginPage.verifyStillOnLoginPage();
    });
  });

  test('HRM-36: Should prevent SQL injection attacks', async ({ page }) => {
    await test.step('Attempt SQL injection in login fields', async () => {
      await loginPage.testSQLInjection("'; DROP TABLE users; --");
    });

    await test.step('Verify application handles SQL injection safely', async () => {
      // Should show normal login error, not SQL error
      await loginPage.verifyStillOnLoginPage();
      
      // Application should still be functional
      await loginPage.clearFields();
      await loginPage.verifyLoginFormDisplayed();
    });

    await test.step('Test additional SQL injection patterns', async () => {
      const sqlInjectionPayloads = [
        "' OR '1'='1",
        "' OR '1'='1' --",
        "'; DELETE FROM users; --",
        "admin'--",
        "admin' /*"
      ];

      for (const payload of sqlInjectionPayloads) {
        await loginPage.clearFields();
        await loginPage.testSQLInjection(payload);
        await loginPage.verifyStillOnLoginPage();
      }
    });
  });

  test('HRM-36: Should prevent XSS attacks in login fields', async ({ page }) => {
    await test.step('Attempt XSS injection in login fields', async () => {
      await loginPage.testXSSInjection('<script>alert("XSS")</script>');
    });

    await test.step('Verify application handles XSS safely', async () => {
      // Should not execute script
      await loginPage.verifyStillOnLoginPage();
      
      // Application should still be functional
      await loginPage.clearFields();
      await loginPage.verifyLoginFormDisplayed();
    });

    await test.step('Test additional XSS patterns', async () => {
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">',
        '<svg onload="alert(\'XSS\')">',
        '"><script>alert("XSS")</script>'
      ];

      for (const payload of xssPayloads) {
        await loginPage.clearFields();
        await loginPage.testXSSInjection(payload);
        await loginPage.verifyStillOnLoginPage();
      }
    });
  });

  // Data-driven testing with multiple invalid credentials
  testData.invalidCredentials.forEach((credential, index) => {
    test(`HRM-36: Should reject invalid credentials set ${index + 1}`, async ({ page }) => {
      await test.step(`Test with: ${credential.description}`, async () => {
        await loginPage.login(credential.username, credential.password);
      });

      await test.step('Verify rejection and error handling', async () => {
        await loginPage.verifyErrorMessage();
        await loginPage.verifyStillOnLoginPage();
      });
    });
  });

  test('HRM-36: Should handle special characters in credentials', async ({ page }) => {
    const specialCharCredentials = [
      { username: 'Admin@#$%', password: 'admin123' },
      { username: 'Admin', password: 'admin@#$%' },
      { username: 'Ädmin', password: 'admin123' }, // Unicode characters
      { username: 'Admin', password: 'αdmin123' }, // Unicode in password
    ];

    for (const cred of specialCharCredentials) {
      await test.step(`Test special characters: ${cred.username}`, async () => {
        await loginPage.clearFields();
        await loginPage.login(cred.username, cred.password);
        await loginPage.verifyErrorMessage();
        await loginPage.verifyStillOnLoginPage();
      });
    }
  });

  test('HRM-36: Should handle very long input strings', async ({ page }) => {
    const longString = 'a'.repeat(1000); // 1000 character string
    
    await test.step('Test with very long username', async () => {
      await loginPage.login(longString, 'admin123');
      await loginPage.verifyStillOnLoginPage();
    });

    await test.step('Test with very long password', async () => {
      await loginPage.clearFields();
      await loginPage.login('Admin', longString);
      await loginPage.verifyStillOnLoginPage();
    });
  });

  test.afterEach(async ({ page }) => {
    // Clear fields after each test
    await loginPage.clearFields();
  });
}); 