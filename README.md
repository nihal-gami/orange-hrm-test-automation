# 🔐 Orange HRM Authentication Test Suite

Comprehensive automated test suite for Orange HRM Demo application focusing on Authentication & Authorization functionality using Playwright and TypeScript.

## 📋 Project Overview

This project implements end-to-end test automation for Orange HRM Demo application with the following test coverage:

### ✅ Test Scenarios Covered

| Test ID | Jira Task | Description | Status |
|---------|-----------|-------------|---------|
| AUTH-001 | [HRM-48](https://velotio-automation.atlassian.net/browse/HRM-48) | Valid Login Test Automation | ✅ |
| AUTH-002 | [HRM-49](https://velotio-automation.atlassian.net/browse/HRM-49) | Invalid Login Test Automation | ✅ |
| AUTH-003 | [HRM-50](https://velotio-automation.atlassian.net/browse/HRM-50) | Password Masking Validation Test | ✅ |
| AUTH-004 | [HRM-51](https://velotio-automation.atlassian.net/browse/HRM-51) | Role-Based Access Control Test | ✅ |
| AUTH-005 | [HRM-52](https://velotio-automation.atlassian.net/browse/HRM-52) | Logout Functionality Test | ✅ |

## 🎯 Epic Information

**Epic**: [HRM-47 - Authentication & Authorization Test Suite](https://velotio-automation.atlassian.net/browse/HRM-47)

**Application Under Test**: [Orange HRM Demo](https://opensource-demo.orangehrmlive.com/)

## 🏗️ Architecture & Design Patterns

### Framework Stack
- **Test Framework**: Playwright
- **Language**: TypeScript
- **Design Pattern**: Page Object Model (POM)
- **Test Organization**: Modular test suites
- **Browser**: Chrome (Single browser as per standards)

### Project Structure
```
orange-hrm-automation/
├── pages/                          # Page Object Model classes
│   ├── BasePage.ts                 # Base page with common functionality
│   ├── LoginPage.ts                # Login page object
│   └── DashboardPage.ts            # Dashboard page object
├── tests/
│   ├── auth/                       # Authentication test suites
│   │   ├── valid-login.test.ts     # Valid login scenarios
│   │   ├── invalid-login.test.ts   # Invalid login scenarios
│   │   ├── password-masking.test.ts # Password masking tests
│   │   ├── role-based-access.test.ts # Role-based access tests
│   │   └── logout.test.ts          # Logout functionality tests
│   ├── data/
│   │   └── auth-test-data.ts       # Centralized test data
│   └── setup/
│       └── global-setup.ts         # Global test configuration
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

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

## 🧪 Running Tests

### All Authentication Tests
```bash
npm run test:auth
```

### Specific Test Categories
```bash
# Valid login tests only
npx playwright test tests/auth/valid-login.test.ts

# Invalid login tests only
npx playwright test tests/auth/invalid-login.test.ts

# Password masking tests
npx playwright test tests/auth/password-masking.test.ts

# Role-based access tests
npx playwright test tests/auth/role-based-access.test.ts

# Logout functionality tests
npx playwright test tests/auth/logout.test.ts
```

### Debug Mode
```bash
npm run test:debug
```

### Headed Mode (Visual)
```bash
npm run test:headed
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

## 📊 Test Reports

### Generate HTML Report
```bash
npm run report
```

### Test Results Location
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/results.xml`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/`

## 🔧 Configuration

### Browser Configuration
Tests are configured to run on **Chrome only** as per testing standards:

```typescript
// playwright.config.ts
projects: [
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      viewport: { width: 1920, height: 1080 }
    }
  }
]
```

### Environment Configuration
- **Base URL**: `https://opensource-demo.orangehrmlive.com/`
- **Timeouts**: 30s test timeout, 10s action timeout
- **Retries**: 2 retries on CI, 0 locally
- **Parallel Execution**: Disabled on CI for resource control

## 🧪 Test Data Management

Centralized test data is managed in `tests/data/auth-test-data.ts`:

```typescript
export const AuthTestData = {
  validCredentials: {
    username: 'Admin',
    password: 'admin123'
  },
  invalidCredentials: [
    // Various invalid combinations for comprehensive testing
  ],
  securityTestData: [
    // SQL injection and XSS test cases
  ]
}
```

## 🔐 Security Testing

The test suite includes security validations:
- **SQL Injection Prevention**
- **XSS Attack Prevention** 
- **Input Sanitization**
- **Session Security**
- **Password Masking**

## 🎯 Best Practices Implemented

### Test Design
✅ **Page Object Model** for maintainable code  
✅ **Data-driven testing** with centralized test data  
✅ **Robust error handling** with try-catch blocks  
✅ **Dynamic waits** instead of hardcoded delays  
✅ **Parallel execution** where appropriate  

### Code Quality
✅ **TypeScript** for type safety  
✅ **Consistent naming conventions**  
✅ **Comprehensive documentation**  
✅ **Modular test organization**  
✅ **Reusable page objects**  

### Reporting
✅ **Multiple report formats** (HTML, JSON, JUnit)  
✅ **Screenshot on failure**  
✅ **Video recording** for debugging  
✅ **Detailed test traces**  

## 🔄 CI/CD Integration

### GitHub Actions Workflow
The project includes a GitHub Actions workflow for automated testing:

```yaml
name: Orange HRM E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run Playwright tests
        run: npx playwright test
```

## 📈 Performance Metrics

### Test Execution Metrics
- **Login Performance**: < 10 seconds
- **Test Suite Execution**: Approximately 2-3 minutes
- **Parallel Workers**: 1 on CI, unlimited locally
- **Retry Strategy**: 2 retries on CI for stability

## 🏷️ Jira Integration

All tests are linked to corresponding Jira tasks:
- **Epic**: [HRM-47](https://velotio-automation.atlassian.net/browse/HRM-47)
- **Individual Tasks**: HRM-48 through HRM-52
- **Documentation**: [Confluence Test Guide](https://velotio-automation.atlassian.net/wiki/x/AwAZ)

## 🐛 Troubleshooting

### Common Issues

**1. Browser Not Found**
```bash
npx playwright install chromium
```

**2. Application Not Accessible**
- Check internet connection
- Verify Orange HRM Demo site is available
- Check proxy settings if applicable

**3. Test Failures Due to Timing**
- Tests include appropriate waits
- Increase timeout in playwright.config.ts if needed

**4. Selector Issues**
- Page objects use robust selectors
- Fallback strategies implemented for dynamic content

## 🤝 Contributing

### Pull Request Guidelines
- Include Jira ticket reference in PR title: `[HRM-XXX] Description`
- Assign GitHub Co-pilot as reviewer
- Ensure all tests pass locally before raising PR
- Include test results in PR description

### Code Standards
- Follow TypeScript best practices
- Use Page Object Model pattern
- Include comprehensive test documentation
- Maintain 2-space indentation (Prettier config)

## 📞 Support

For issues and questions:
- **Jira**: Create tickets in the HRM project
- **Documentation**: [Confluence Test Guide](https://velotio-automation.atlassian.net/wiki/x/AwAZ)
- **Team**: Test Automation Team

## 📝 License

MIT License - See LICENSE file for details

---

**Last Updated**: January 2025  
**Maintainer**: Test Automation Team  
**Version**: 1.0.0
