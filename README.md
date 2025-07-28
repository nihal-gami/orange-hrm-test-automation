# Orange HRM Demo - Test Automation Suite 🚀

[![Playwright Tests](https://github.com/your-org/orange-hrm-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/your-org/orange-hrm-automation/actions/workflows/playwright.yml)

A comprehensive end-to-end test automation suite for the Orange HRM Demo application, built with Playwright and TypeScript following the Page Object Model pattern.

## 📋 Project Overview

This project implements automated testing for the Orange HRM Demo application authentication and authorization workflows. The test suite covers critical security scenarios and user access control validation.

**Application Under Test**: [Orange HRM Demo](https://opensource-demo.orangehrmlive.com/)

### 🎯 Test Coverage

#### 🔐 Authentication & Authorization Epic (HRM-41)

| Jira Task | Test Scenario | Status |
|-----------|---------------|--------|
| HRM-42 | Valid Login Test Automation | ✅ Implemented |
| HRM-43 | Invalid Login Attempts Test Automation | ✅ Implemented |
| HRM-44 | Password Field Masking Test Automation | ✅ Implemented |
| HRM-45 | Role-Based Access Control Test Automation | ✅ Implemented |
| HRM-46 | Logout Functionality Test Automation | ✅ Implemented |

## 🛠️ Technology Stack

- **Framework**: Playwright
- **Language**: TypeScript
- **Pattern**: Page Object Model (POM)
- **Browser**: Chrome (as per automation standards)
- **CI/CD**: GitHub Actions
- **Reporting**: HTML, JSON, JUnit

## 📁 Project Structure

```
orange-hrm-test-automation/
├── pages/                          # Page Object Model classes
│   ├── BasePage.ts                # Base page with common functionality
│   ├── LoginPage.ts               # Login page interactions
│   └── DashboardPage.ts           # Dashboard page interactions
├── tests/                         # Test files
│   ├── auth/                      # Authentication test suites
│   │   ├── valid-login.test.ts    # HRM-42: Valid login tests
│   │   ├── invalid-login.test.ts  # HRM-43: Invalid login tests
│   │   ├── password-masking.test.ts # HRM-44: Password security tests
│   │   ├── role-based-access.test.ts # HRM-45: Access control tests
│   │   └── logout.test.ts         # HRM-46: Logout functionality tests
│   ├── data/                      # Test data files
│   │   └── auth-test-data.ts      # Authentication test data
│   └── setup/                     # Test configuration
│       └── global-setup.ts        # Global test setup
├── test-results/                  # Test execution results
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies
└── tsconfig.json                  # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orange-hrm-test-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

### Running Tests

#### Execute All Tests
```bash
npm test
```

#### Execute Authentication Tests Only
```bash
npm run test:auth
```

#### Execute Tests in Headed Mode
```bash
npm run test:headed
```

#### Debug Tests
```bash
npm run test:debug
```

#### Interactive UI Mode
```bash
npm run test:ui
```

#### Chrome-Only Execution
```bash
npm run test:chrome
```

### View Test Reports
```bash
npm run report
```

## 📊 Test Scenarios

### 🔑 Valid Login Tests (HRM-42)
- Successful login with Admin credentials
- Dashboard elements verification
- Session maintenance validation

### ❌ Invalid Login Tests (HRM-43)
- Invalid username scenarios
- Invalid password scenarios
- Empty field validation
- Multiple consecutive attempts
- Error message validation

### 🔒 Password Security Tests (HRM-44)
- Password field masking verification
- DOM exposure prevention
- Copy-paste security handling
- Form interaction security

### 👤 Role-Based Access Tests (HRM-45)
- Admin user full system access
- Module-specific access validation
- Navigation permissions consistency

### 🚪 Logout Functionality Tests (HRM-46)
- Successful logout and redirect
- Session termination validation
- Protected page access prevention
- Browser back button handling
- Re-login capability

## 🎨 Automation Standards

### Design Principles
- **Page Object Model**: Maintainable test structure
- **Data-Driven Testing**: External data sources for test inputs
- **Dynamic Waits**: No hardcoded sleeps, robust wait mechanisms
- **Error Handling**: Comprehensive try-catch blocks
- **Chrome-Only**: Single browser execution as per standards

### Security Testing Features
- SQL Injection validation readiness
- XSS vulnerability testing capabilities
- Password security validation
- Session management verification

### Best Practices
- Comprehensive error handling
- Screenshot capture on failures
- Detailed logging and reporting
- Clean test data management
- Parallel test execution support

## 🔧 Configuration

### Test Environment
- **Base URL**: https://opensource-demo.orangehrmlive.com
- **Browser**: Chrome (Desktop)
- **Viewport**: 1920x1080
- **Timeout**: 60 seconds per test
- **Retries**: 2 on CI, 0 locally

### Credentials
- **Username**: Admin
- **Password**: admin123

## 📈 Reporting

The test suite generates multiple report formats:
- **HTML Report**: Interactive test results with screenshots
- **JSON Report**: Machine-readable test results
- **JUnit XML**: CI/CD integration compatible format

## 🔄 CI/CD Integration

### GitHub Actions Workflow
- Automated test execution on pull requests
- Single execution node for consistency
- Artifact collection for test results
- Automatic browser installation

### Pre-commit Checks
- Playwright tests must pass locally before PR submission
- Code formatting with Prettier (2-space indentation)
- TypeScript compilation validation

## 📝 Contributing

### Pull Request Guidelines
1. **Jira Integration**: Include Jira ticket key in PR title and description
2. **Format**: `[JIRA_KEY] Brief description of changes`
3. **Testing**: Ensure all tests pass locally before submission
4. **Review**: Assign at least one reviewer and GitHub Co-pilot
5. **Documentation**: Update test documentation as needed

### Code Standards
- Follow existing TypeScript patterns
- Maintain Page Object Model structure
- Include comprehensive test documentation
- Use descriptive test names and assertions

## 🆘 Troubleshooting

### Common Issues

#### Browser Installation
```bash
npx playwright install chromium
```

#### Test Timeout Issues
- Increase timeout in `playwright.config.ts`
- Check network connectivity to Orange HRM demo

#### Page Load Issues
- Verify Orange HRM demo accessibility
- Check global setup configuration

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Orange HRM Demo](https://opensource-demo.orangehrmlive.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 📧 Support

For questions or issues:
- Create an issue in the repository
- Contact the Test Automation Team
- Refer to Confluence documentation

---

**Last Updated**: January 2025  
**Maintainer**: Test Automation Team  
**Project**: Orange HRM Demo Test Automation  
**Epic**: HRM-41 🔐 Authentication & Authorization 