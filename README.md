# 🧪 Orange HRM Test Automation Suite

![Test Status](https://img.shields.io/badge/Tests-43%2F47%20Passing-green)
![Playwright](https://img.shields.io/badge/Playwright-1.39+-blue)
![Browser](https://img.shields.io/badge/Browser-Chrome%20Only-orange)
![Workers](https://img.shields.io/badge/Workers-2%20Parallel-lightblue)

## 🎯 Overview

Comprehensive end-to-end test automation suite for Orange HRM demo application, focusing on authentication and authorization workflows. Built with Playwright and following Page Object Model (POM) architecture.

## 🏗️ Architecture

### Page Object Model (POM)
- **BasePage.ts**: Core functionality and common page operations
- **LoginPage.ts**: Authentication-specific actions and validations
- **DashboardPage.ts**: Post-login navigation and user interactions

### Test Organization
```
tests/
├── auth/
│   ├── valid-login.test.ts        # ✅ Successful login scenarios
│   ├── invalid-login.test.ts      # ❌ Failed login validations
│   ├── logout.test.ts             # 🚪 Session termination tests
│   ├── password-masking.test.ts   # 🔒 Security validations
│   └── role-based-access.test.ts  # 👤 Authorization tests
├── data/
│   └── auth-test-data.ts          # 📊 Centralized test data
└── setup/
    └── global-setup.ts            # 🔧 Environment validation
```

## 🚀 Test Execution Results

### ✅ Local Test Results (Latest Run)
- **Total Tests**: 47
- **Passed**: 43 (91.5%)
- **Failed**: 4 (8.5%) - Network rate limiting
- **Execution Time**: ~5.4 minutes
- **Workers**: 2 parallel execution

### 🧪 Test Coverage
- ✅ Valid login scenarios
- ✅ Invalid credential handling
- ✅ Password masking verification
- ✅ Session management
- ✅ Role-based access control
- ✅ Multi-module logout testing
- ✅ Security validations

## 🔧 Setup & Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests
npm test
```

## 🎮 Test Execution Commands

```bash
# Run all tests with 2 workers (recommended)
npx playwright test --workers=2

# Run specific test file
npx playwright test tests/auth/valid-login.test.ts

# Run tests with UI mode
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

## 📊 Test Configuration

### Browser Support
Following automation rules: **Chrome-only testing**
- Primary: Chrome (Desktop)
- Viewport: 1280x720
- Headless: Configurable

### Parallel Execution
- **Workers**: 2 (optimized for stability)
- **Timeout**: 45 seconds per test
- **Retries**: 2 on CI, 0 locally

## 🔗 Related Resources

- **Jira Epic**: [AUTH-1](https://velotio-automation.atlassian.net/browse/AUTH-1) - Authentication & Authorization
- **Confluence Documentation**: [Test Coverage Details](https://velotio-automation.atlassian.net/wiki/x/AwAZ)
- **Application Under Test**: [Orange HRM Demo](https://opensource-demo.orangehrmlive.com)

## 🧭 Key Features

- 🏗️ **Page Object Model**: Maintainable and scalable architecture
- 📊 **Data-Driven Testing**: Centralized test data management
- 🔄 **Parallel Execution**: Optimized for CI/CD pipelines
- 📸 **Rich Reporting**: Screenshots, videos, and traces on failure
- 🔒 **Security Testing**: Password masking and session validation
- 🌐 **Cross-Module Testing**: Authentication across different application areas

## 📈 Future Enhancements

- [ ] API testing integration
- [ ] Visual regression testing
- [ ] Performance testing scenarios
- [ ] Extended browser support (if requirements change)
- [ ] Mobile responsive testing

---

**Built with ❤️ using Playwright + TypeScript**
