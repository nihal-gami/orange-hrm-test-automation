# Orange HRM Demo - Authentication Test Automation Suite

🔐 Comprehensive test automation suite for Orange HRM Demo authentication and authorization functionality.

## 📋 Project Overview

This project implements automated testing for the Orange HRM Demo application, specifically focusing on authentication and authorization scenarios. The test suite is designed following industry best practices and covers all critical security aspects.

### 🎯 Epic & User Stories

**Epic**: [HRM-34] 🔐 Authentication & Authorization

**Covered Jira Tasks**:
- **HRM-35**: Valid Login Test - Correct Credentials
- **HRM-36**: Invalid Login Tests - Multiple Scenarios
- **HRM-37**: Password Field Masking Test
- **HRM-38**: Role-Based Access Control Tests
- **HRM-39**: Logout Functionality Test
- **HRM-40**: Session Timeout Test

## 🛠️ Technology Stack

- **Framework**: Playwright with TypeScript
- **Browser**: Chrome (as per automation rules)
- **Pattern**: Page Object Model (POM)
- **CI/CD**: GitHub Actions
- **Reporting**: HTML, JSON, JUnit reports

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Chrome browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd orange-hrm-automation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chrome
```

### Running Tests

```bash
# Run all authentication tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode for debugging
npm run test:ui

# Run specific test suite
npm run test:auth

# Generate and view test report
npm run test:report
```

## 📁 Project Structure

```
orange-hrm-automation/
├── pages/                          # Page Object Model classes
│   ├── BasePage.ts                 # Base page with common functionality
│   ├── LoginPage.ts                # Login page interactions
│   └── DashboardPage.ts            # Dashboard and navigation
├── tests/                          # Test specifications
│   ├── auth/                       # Authentication test suites
│   │   ├── valid-login.test.ts     # HRM-35: Valid login tests
│   │   ├── invalid-login.test.ts   # HRM-36: Invalid login scenarios
│   │   ├── password-masking.test.ts # HRM-37: Password security tests
│   │   ├── role-based-access.test.ts # HRM-38: Role-based access tests
│   │   ├── logout.test.ts          # HRM-39: Logout functionality
│   │   └── session-timeout.test.ts # HRM-40: Session timeout tests
│   ├── data/                       # Test data and configurations
│   │   └── auth-test-data.ts       # Authentication test data
│   └── setup/                      # Global test setup
│       └── global-setup.ts         # Environment verification
├── test-results/                   # Test execution results
│   ├── html-report/               # HTML test reports
│   ├── screenshots/               # Failure screenshots
│   └── artifacts/                 # Test artifacts
├── .github/workflows/             # CI/CD pipelines
│   └── playwright.yml             # GitHub Actions workflow
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies
└── README.md                      # Project documentation
```

## 🧪 Test Coverage

### Authentication Scenarios

#### ✅ Valid Login (HRM-35)
- Successful login with correct credentials
- Session persistence across navigation
- Admin role verification
- Network resilience testing

#### ❌ Invalid Login (HRM-36)
- Invalid username/password combinations
- Empty field validation
- SQL injection prevention
- XSS attack prevention
- Edge case handling (long strings, special characters)

#### 🔒 Password Masking (HRM-37)
- Password field type verification
- Visual masking confirmation
- Security attribute validation
- Copy-paste operation security
- JavaScript manipulation prevention

#### 👥 Role-Based Access (HRM-38)
- Admin role full access verification
- Module-specific permissions
- Unauthorized URL access prevention
- Menu visibility based on role
- Data access restrictions

#### 🚪 Logout Functionality (HRM-39)
- Successful logout and redirect
- Session cleanup verification
- Back button security
- Multi-tab logout handling
- Network issue resilience

#### ⏱️ Session Timeout (HRM-40)
- Session timeout simulation
- Inactive session handling
- Multi-tab session management
- AJAX request timeout handling
- Session extension on activity

## 🔧 Configuration

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
# Test Environment
BASE_URL=https://opensource-demo.orangehrmlive.com
DEFAULT_USERNAME=Admin
DEFAULT_PASSWORD=admin123

# Test Execution
HEADLESS=true
TIMEOUT=30000
RETRIES=2

# Reporting
REPORT_PATH=./test-results
SCREENSHOT_ON_FAILURE=true
```

### Browser Configuration

Following workspace automation rules, tests run exclusively on Chrome:

```typescript
// playwright.config.ts
projects: [
  {
    name: 'chrome',
    use: { 
      ...devices['Desktop Chrome'],
      viewport: { width: 1920, height: 1080 }
    },
  },
]
```

## 📊 Reporting & Analytics

### Test Reports

- **HTML Report**: Interactive test results with screenshots
- **JSON Report**: Structured data for integration
- **JUnit Report**: CI/CD compatibility

### Key Metrics Tracked

- Test execution time
- Pass/fail rates
- Coverage percentage
- Browser performance
- Security vulnerability detection

## 🔄 CI/CD Integration

### GitHub Actions Workflow

```yaml
# Automated execution on:
- Push to main/feature branches
- Pull requests
- Daily scheduled runs (2 AM UTC)
- Manual triggers
```

### Pull Request Integration

- Automatic test execution on PR creation
- Test results commented on PR
- GitHub Copilot assigned as reviewer
- Jira ticket linking in PR description

## 🛡️ Security Testing

### Implemented Security Checks

- **SQL Injection**: Multiple payload testing
- **XSS Prevention**: Cross-site scripting attempts
- **Session Security**: Timeout and cleanup validation
- **Access Control**: Role-based permission verification
- **Password Security**: Field masking and protection

### Security Test Data

```typescript
// Example SQL injection payloads
sqlInjectionPayloads: [
  "'; DROP TABLE users; --",
  "' OR '1'='1",
  "' UNION SELECT * FROM users --"
]

// Example XSS payloads
xssPayloads: [
  '<script>alert("XSS")</script>',
  'javascript:alert("XSS")',
  '<img src="x" onerror="alert(\'XSS\')">'
]
```

## 📈 Best Practices Implemented

### Code Quality
- TypeScript for type safety
- ESLint for code standards
- Page Object Model pattern
- Data-driven testing approach

### Test Design
- Robust error handling
- Dynamic waits over fixed delays
- Comprehensive assertions
- Screenshot capture on failures

### Maintenance
- Modular test structure
- Reusable page components
- Centralized test data
- Clear documentation

## 🐛 Troubleshooting

### Common Issues

#### Tests Failing to Start
```bash
# Ensure browsers are installed
npx playwright install chrome

# Check Node.js version
node --version  # Should be 18+
```

#### Login Issues
```bash
# Verify Orange HRM demo is accessible
curl -I https://opensource-demo.orangehrmlive.com

# Check credentials in test data
# Default: Admin / admin123
```

#### Timeout Errors
```bash
# Increase timeout in playwright.config.ts
timeout: 60000  # 60 seconds

# Or for specific tests
test.setTimeout(120000);  # 2 minutes
```

### Debugging Tests

```bash
# Run in debug mode
npm run test:debug

# Run with UI mode
npm run test:ui

# Run specific test file
npx playwright test tests/auth/valid-login.test.ts --debug
```

## 🤝 Contributing

### Development Workflow

1. Create feature branch from `main`
2. Implement tests following POM pattern
3. Ensure all tests pass locally
4. Create PR with Jira ticket reference
5. Assign GitHub Copilot as reviewer
6. Merge after approval and green tests

### Coding Standards

- Follow TypeScript best practices
- Use meaningful test descriptions
- Include proper error handling
- Add comments for complex logic
- Update documentation for new features

## 📞 Support & Contact

### Team Information
- **Maintainer**: Test Automation Team
- **Epic Owner**: Product Owner
- **Jira Project**: HRM (test automation)

### Resources
- **Orange HRM Demo**: https://opensource-demo.orangehrmlive.com
- **Playwright Docs**: https://playwright.dev
- **Project Wiki**: [Internal wiki link]

---

## 📋 Test Execution Checklist

- [ ] ✅ Valid login functionality verified
- [ ] ❌ Invalid login scenarios covered
- [ ] 🔒 Password masking security confirmed
- [ ] 👥 Role-based access tested
- [ ] 🚪 Logout functionality validated
- [ ] ⏱️ Session timeout handling verified
- [ ] 📊 Test reports generated
- [ ] 🔄 CI/CD pipeline successful
- [ ] 📝 PR documentation updated

*Last Updated: January 2025*  
*Framework: Playwright v1.41.0*  
*Browser: Chrome (Latest)* 