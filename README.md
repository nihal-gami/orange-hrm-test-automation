# Orange HRM Test Automation Suite 🧪

[![Playwright Tests](https://github.com/your-username/orange-hrm-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/your-username/orange-hrm-automation/actions/workflows/playwright.yml)

This repository contains automated tests for the Orange HRM application using Playwright and TypeScript, following the Page Object Model (POM) design pattern.

## 🎯 Project Overview

**Application Under Test**: [Orange HRM Demo](https://opensource-demo.orangehrmlive.com/)  
**Testing Framework**: Playwright with TypeScript  
**Design Pattern**: Page Object Model (POM)  
**Browser Support**: Chrome (as per testing standards)  

### 📋 Test Coverage

This test suite covers the **Authentication & Authorization Epic** with the following test scenarios:

#### 🔐 Authentication Tests
- ✅ **Valid Login** ([HRM-28](https://velotio-automation.atlassian.net/browse/HRM-28))
- ✅ **Invalid Login Attempts** ([HRM-29](https://velotio-automation.atlassian.net/browse/HRM-29))
- ✅ **Password Field Masking** ([HRM-30](https://velotio-automation.atlassian.net/browse/HRM-30))
- ✅ **Session Timeout Handling** ([HRM-31](https://velotio-automation.atlassian.net/browse/HRM-31))
- ✅ **Role-Based Access Control** ([HRM-32](https://velotio-automation.atlassian.net/browse/HRM-32))
- ✅ **Logout Functionality** ([HRM-33](https://velotio-automation.atlassian.net/browse/HRM-33))

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orange-hrm-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install chromium
   ```

4. **Verify installation**
   ```bash
   npm run test:auth
   ```

## 🚀 Running Tests

### All Authentication Tests
```bash
npm run test:auth
```

### Specific Test Suites
```bash
# Valid login tests
npx playwright test tests/auth/valid-login.test.ts

# Invalid login tests
npx playwright test tests/auth/invalid-login.test.ts

# Password masking tests
npx playwright test tests/auth/password-masking.test.ts

# Session timeout tests
npx playwright test tests/auth/session-timeout.test.ts

# Role-based access tests
npx playwright test tests/auth/role-based-access.test.ts

# Logout tests
npx playwright test tests/auth/logout.test.ts
```

### Test Execution Options

```bash
# Run tests in headed mode (browser visible)
npm run test:headed

# Run tests with debug mode
npm run test:debug

# Run tests in Chrome only
npm run test:chrome

# Generate and show test report
npm run report
```

## 📊 Test Reports

After running tests, you can view detailed reports:

```bash
npm run report
```

This opens an interactive HTML report showing:
- Test execution results
- Screenshots and videos for failed tests
- Test execution timeline
- Detailed error information

## 🏗️ Project Structure

```
orange-hrm-automation/
├── pages/                          # Page Object Models
│   ├── BasePage.ts                 # Base page with common functionality
│   ├── LoginPage.ts                # Login page objects and methods
│   └── DashboardPage.ts            # Dashboard page objects and methods
├── tests/
│   └── auth/                       # Authentication test suites
│       ├── valid-login.test.ts     # HRM-28: Valid login tests
│       ├── invalid-login.test.ts   # HRM-29: Invalid login tests
│       ├── password-masking.test.ts # HRM-30: Password masking tests
│       ├── session-timeout.test.ts # HRM-31: Session timeout tests
│       ├── role-based-access.test.ts # HRM-32: Role access tests
│       └── logout.test.ts          # HRM-33: Logout tests
├── test-results/                   # Test execution results
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Project dependencies and scripts
└── README.md                      # This file
```

## 🔧 Configuration

### Playwright Configuration

The project is configured to run tests with the following settings:

- **Browser**: Chromium only (following testing standards)
- **Viewport**: 1920x1080
- **Base URL**: https://opensource-demo.orangehrmlive.com
- **Timeout**: 10 seconds for actions, 30 seconds for navigation
- **Retries**: 2 retries on CI, 0 locally
- **Reporters**: HTML, JUnit, JSON

### Test Data

Default credentials for testing:
- **Username**: `Admin`
- **Password**: `admin123`

## 🧪 Test Design Principles

### Page Object Model (POM)
- Encapsulates page elements and actions in separate classes
- Promotes code reusability and maintainability
- Separates test logic from page interaction logic

### Error Handling
- Robust error handling using try-catch blocks
- Dynamic waits with Playwright's built-in wait mechanisms
- No hardcoded waits (sleep) for better stability

### Security Testing
- Validates password field masking
- Tests session timeout and cleanup
- Verifies role-based access controls
- Checks for proper logout functionality

## 📈 Continuous Integration

### GitHub Actions Workflow

The project includes a GitHub Actions workflow that:
- Runs tests on push to main branch
- Executes tests on a single node (Chrome only)
- Generates test reports and artifacts
- Follows the pre-check rule: tests must pass locally before PR

### Local Pre-check
Before raising a PR:
1. Run tests locally: `npm run test:auth`
2. Ensure all tests pass ✅
3. Review test results and screenshots
4. Commit changes and raise PR

## 🔗 Related Links

- **Epic**: [HRM-27 - Authentication & Authorization](https://velotio-automation.atlassian.net/browse/HRM-27)
- **Confluence**: [Orange HRM Testing Guide](https://velotio-automation.atlassian.net/wiki/spaces/TA/pages/1638403)
- **Application**: [Orange HRM Demo](https://opensource-demo.orangehrmlive.com/)
- **Playwright Docs**: [playwright.dev](https://playwright.dev/)

## 🤝 Contributing

1. Create a new branch from `main`
2. Make your changes following the existing patterns
3. Run tests locally to ensure they pass
4. Commit with descriptive messages
5. Raise a PR with proper Jira ticket reference
6. Assign GitHub Copilot as reviewer

### PR Title Format
```
[JIRA_KEY] Brief description of changes
```

### PR Description Template
```markdown
## Jira Ticket
[HRM-XXX](https://velotio-automation.atlassian.net/browse/HRM-XXX)

## Summary of Changes
- Brief description of what was changed
- Key files modified
- Test scenarios added/updated

## Test Results
- ✅ All tests passing locally
- Browser: Chrome
- Test execution time: X minutes
```

## 🚨 Troubleshooting

### Common Issues

1. **Browser not installed**
   ```bash
   npx playwright install chromium
   ```

2. **Tests failing due to timeouts**
   - Check network connection
   - Verify Orange HRM demo site is accessible
   - Increase timeout in playwright.config.ts if needed

3. **Element not found errors**
   - Verify selectors in page objects
   - Check if application UI has changed
   - Update locators if necessary

### Debug Mode
Run tests in debug mode for step-by-step execution:
```bash
npm run test:debug
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support:
- Create an issue in this repository
- Contact the test automation team
- Check the Confluence documentation

---

**Maintainer**: Nihal Gami  
**Last Updated**: January 2025  
**Version**: 1.0.0 