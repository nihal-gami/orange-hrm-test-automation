# Orange HRM Automation Suite

[![Playwright Tests](https://github.com/nihal-gami/orange-hrm-automation-suite/actions/workflows/playwright.yml/badge.svg)](https://github.com/nihal-gami/orange-hrm-automation-suite/actions/workflows/playwright.yml)

Automated test suite for Orange HRM Demo application using Playwright. This project implements comprehensive authentication and authorization test scenarios based on the [Confluence Test Documentation](https://velotio-automation.atlassian.net/wiki/spaces/TA/pages/1638403/Orange+HRM+Demo+-+Automation+Testing+Guide).

## 🎯 Project Overview

This automation suite covers the following test areas for the Orange HRM Demo application:

### Authentication & Authorization (Epic: HRM-53)
- **HRM-54**: Valid login functionality
- **HRM-55**: Invalid login handling and security
- **HRM-56**: Password field masking and security
- **HRM-57**: Role-based access control
- **HRM-58**: Logout functionality and session management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nihal-gami/orange-hrm-automation-suite.git
   cd orange-hrm-automation-suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install chromium
   ```

4. **Create test data directory**
   ```bash
   mkdir -p test-data
   ```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Authentication Tests Only
```bash
npm run test:auth
```

### Debug Tests
```bash
npm run test:debug
```

### Run Tests with UI Mode
```bash
npm run test:ui
```

### View Test Report
```bash
npm run report
```

## 📁 Project Structure

```
orange-hrm-automation-suite/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline
├── pages/
│   ├── BasePage.ts                 # Base page object
│   ├── LoginPage.ts                # Login page object
│   └── DashboardPage.ts            # Dashboard page object
├── tests/
│   ├── auth/
│   │   ├── valid-login.test.ts     # HRM-54: Valid login tests
│   │   ├── invalid-login.test.ts   # HRM-55: Invalid login tests
│   │   ├── password-masking.test.ts # HRM-56: Password masking tests
│   │   ├── role-based-access.test.ts # HRM-57: Role-based access tests
│   │   └── logout.test.ts          # HRM-58: Logout tests
│   ├── data/
│   │   └── auth-test-data.ts       # Test data
│   └── setup/
│       └── global-setup.ts         # Global test setup
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Project dependencies
└── README.md                       # Project documentation
```

## 🔧 Configuration

### Test Environment
- **Application URL**: https://opensource-demo.orangehrmlive.com/
- **Default Credentials**: Admin / admin123
- **Browser**: Chrome (Chromium)
- **Test Framework**: Playwright
- **Language**: TypeScript

### Configuration Files
- `playwright.config.ts`: Main Playwright configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: Dependencies and scripts

## 📊 Test Reporting

Tests generate multiple types of reports:
- **HTML Report**: Comprehensive test results with screenshots
- **JUnit XML**: For CI/CD integration
- **JSON Report**: Programmatic access to test results

View reports:
```bash
npm run report
```

## 🛠️ Development Guidelines

### Page Object Model (POM)
- All page interactions are implemented using the Page Object Model
- Page objects extend `BasePage` for common functionality
- Locators are defined as class properties for reusability

### Test Data Management
- Test data is centralized in `tests/data/` directory
- Use data-driven testing for multiple test scenarios
- Keep sensitive data out of version control

### Security Testing
- Password masking validation
- SQL injection prevention
- XSS attack prevention
- Session security testing

## 🚀 CI/CD Integration

### GitHub Actions
The project includes a GitHub Actions workflow that:
- Runs tests on push to main/develop branches
- Executes daily scheduled test runs
- Supports manual workflow triggers
- Uploads test artifacts and failure videos
- Runs on single execution node for consistency

### Branch Protection
- Tests must pass before merging
- PR reviews required
- GitHub Copilot assigned as reviewer

## 📋 Test Coverage

### Authentication Tests
- ✅ Valid login with correct credentials
- ✅ Invalid login attempts and error handling
- ✅ Password field masking and security
- ✅ Role-based access control validation
- ✅ Logout functionality and session termination

### Security Validations
- ✅ SQL injection prevention
- ✅ XSS attack prevention
- ✅ Password field security
- ✅ Session management
- ✅ Unauthorized access prevention

## 🔗 Related Links

- **Jira Epic**: [HRM-53 - Authentication & Authorization Testing](https://velotio-automation.atlassian.net/browse/HRM-53)
- **Confluence Documentation**: [Orange HRM Test Guide](https://velotio-automation.atlassian.net/wiki/spaces/TA/pages/1638403/Orange+HRM+Demo+-+Automation+Testing+Guide)
- **Application Under Test**: [Orange HRM Demo](https://opensource-demo.orangehrmlive.com/)

## 🐛 Troubleshooting

### Common Issues

1. **Browser Installation**
   ```bash
   npx playwright install chromium --with-deps
   ```

2. **Test Data Directory**
   ```bash
   mkdir -p test-data
   ```

3. **Network Issues**
   - Check internet connectivity
   - Verify Orange HRM demo site is accessible
   - Review proxy settings if applicable

### Debug Mode
Run tests in debug mode to troubleshoot failures:
```bash
npm run test:debug
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes following the established patterns
4. Add/update tests as needed
5. Ensure all tests pass locally
6. Create a pull request with Copilot as reviewer

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues:
- Create a GitHub issue
- Contact the Test Automation Team
- Reference Jira tickets for specific test scenarios

---

**Last Updated**: January 2025  
**Maintainer**: Test Automation Team 