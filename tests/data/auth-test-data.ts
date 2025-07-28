/**
 * Authentication Test Data
 * Centralized test data for Orange HRM authentication scenarios
 */

export const AuthTestData = {
  // Valid credentials
  validCredentials: {
    username: 'Admin',
    password: 'admin123'
  },

  // Invalid credential combinations for negative testing
  invalidCredentials: [
    {
      testCase: 'Invalid Username + Valid Password',
      username: 'InvalidUser',
      password: 'admin123',
      expectedError: 'Invalid credentials'
    },
    {
      testCase: 'Valid Username + Invalid Password',
      username: 'Admin',
      password: 'wrongpassword',
      expectedError: 'Invalid credentials'
    },
    {
      testCase: 'Invalid Username + Invalid Password',
      username: 'WrongUser',
      password: 'wrongpassword',
      expectedError: 'Invalid credentials'
    },
    {
      testCase: 'Empty Username + Valid Password',
      username: '',
      password: 'admin123',
      expectedError: 'Required'
    },
    {
      testCase: 'Valid Username + Empty Password',
      username: 'Admin',
      password: '',
      expectedError: 'Required'
    },
    {
      testCase: 'Both Fields Empty',
      username: '',
      password: '',
      expectedError: 'Required'
    }
  ],

  // Security test data for validation
  securityTestData: [
    {
      testCase: 'SQL Injection in Username',
      username: "admin' OR '1'='1",
      password: 'admin123',
      expectedError: 'Invalid credentials'
    },
    {
      testCase: 'SQL Injection in Password',
      username: 'Admin',
      password: "' OR '1'='1",
      expectedError: 'Invalid credentials'
    },
    {
      testCase: 'XSS Script in Username',
      username: '<script>alert("xss")</script>',
      password: 'admin123',
      expectedError: 'Invalid credentials'
    },
    {
      testCase: 'XSS Script in Password',
      username: 'Admin',
      password: '<script>alert("xss")</script>',
      expectedError: 'Invalid credentials'
    }
  ],

  // User roles for access control testing
  userRoles: {
    admin: {
      username: 'Admin',
      password: 'admin123',
      role: 'Admin',
      expectedMenus: ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard', 'Directory', 'Maintenance', 'Buzz'],
      restrictedMenus: []
    },
    // Note: In demo environment, we primarily have Admin access
    // In real scenarios, you would have additional roles like:
    employee: {
      username: 'Employee', // Placeholder - not available in demo
      password: 'employee123',
      role: 'ESS',
      expectedMenus: ['My Info', 'Leave', 'Time'],
      restrictedMenus: ['Admin', 'PIM', 'Recruitment']
    }
  },

  // Password masking test data
  passwordMaskingTests: [
    {
      testCase: 'Simple Password',
      password: 'testpass123',
      shouldBeMasked: true
    },
    {
      testCase: 'Special Characters Password',
      password: 'test@#$%^&*()',
      shouldBeMasked: true
    },
    {
      testCase: 'Long Password',
      password: 'thisisaverylongpasswordfortesting12345',
      shouldBeMasked: true
    }
  ],

  // Application URLs
  urls: {
    loginPage: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    dashboardPage: 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index',
    baseUrl: 'https://opensource-demo.orangehrmlive.com/'
  },

  // Expected error messages
  errorMessages: {
    invalidCredentials: 'Invalid credentials',
    requiredField: 'Required',
    sessionExpired: 'Session has expired',
    accessDenied: 'Access Denied'
  },

  // Timeouts and waits
  timeouts: {
    loginTimeout: 10000,
    pageLoadTimeout: 15000,
    elementWaitTimeout: 5000
  }
};

export default AuthTestData; 