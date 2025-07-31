/**
 * Authentication Test Data
 * Centralized test data for all authentication scenarios
 * Following data-driven testing approach as per automation rules
 */

export interface LoginCredentials {
  username: string;
  password: string;
  description: string;
  expectedResult: 'success' | 'failure';
  expectedError?: string;
}

export interface UserRole {
  roleName: string;
  username: string;
  password: string;
  expectedMenuItems: string[];
  restrictedMenuItems?: string[];
}

/**
 * Valid login credentials for successful authentication
 */
export const validCredentials: LoginCredentials = {
  username: 'Admin',
  password: 'admin123',
  description: 'Valid admin credentials',
  expectedResult: 'success'
};

/**
 * Invalid login scenarios for negative testing
 */
export const invalidCredentials: LoginCredentials[] = [
  {
    username: 'InvalidUser',
    password: 'admin123',
    description: 'Invalid username with valid password',
    expectedResult: 'failure',
    expectedError: 'Invalid credentials'
  },
  {
    username: 'Admin',
    password: 'wrongpassword',
    description: 'Valid username with invalid password',
    expectedResult: 'failure',
    expectedError: 'Invalid credentials'
  },
  {
    username: 'InvalidUser',
    password: 'wrongpassword',
    description: 'Both username and password invalid',
    expectedResult: 'failure',
    expectedError: 'Invalid credentials'
  },
  {
    username: '',
    password: 'admin123',
    description: 'Empty username with valid password',
    expectedResult: 'failure',
    expectedError: 'Required'
  },
  {
    username: 'Admin',
    password: '',
    description: 'Valid username with empty password',
    expectedResult: 'failure',
    expectedError: 'Required'
  },
  {
    username: '',
    password: '',
    description: 'Both username and password empty',
    expectedResult: 'failure',
    expectedError: 'Required'
  },
  {
    username: 'admin@123',
    password: 'pass@word!',
    description: 'Special characters in credentials',
    expectedResult: 'failure',
    expectedError: 'Invalid credentials'
  },
  {
    username: '   Admin   ',
    password: '   admin123   ',
    description: 'Credentials with leading/trailing spaces',
    expectedResult: 'failure',
    expectedError: 'Invalid credentials'
  }
];

/**
 * User roles and their expected access permissions
 */
export const userRoles: UserRole[] = [
  {
    roleName: 'Admin',
    username: 'Admin',
    password: 'admin123',
    expectedMenuItems: [
      'Admin',
      'PIM',
      'Leave',
      'Time',
      'Recruitment',
      'My Info',
      'Performance',
      'Dashboard',
      'Directory',
      'Maintenance',
      'Buzz'
    ],
    restrictedMenuItems: []
  }
  // Note: Other user roles would be added here if available in the demo
  // ESS users, HR managers, etc. would have different access permissions
];

/**
 * Password masking test scenarios
 */
export const passwordMaskingTests = {
  testPassword: 'TestPassword123!',
  expectedMaskChar: '•', // Common masking character
  expectedInputType: 'password'
};

/**
 * Logout test scenarios
 */
export const logoutScenarios = [
  {
    description: 'Standard logout flow',
    navigateAfterLogout: false
  },
  {
    description: 'Logout and verify session termination with back button',
    navigateAfterLogout: true,
    backButtonTest: true
  },
  {
    description: 'Logout and verify direct URL access blocked',
    navigateAfterLogout: true,
    directUrlTest: true,
    urlToTest: '/web/index.php/dashboard/index'
  }
];

/**
 * Browser-specific test configurations
 * Following automation rules: Chrome only testing
 */
export const browserConfig = {
  browser: 'chrome',
  viewport: { width: 1280, height: 720 },
  headless: false // For local testing visibility
};

/**
 * Test environment URLs
 */
export const urls = {
  baseUrl: 'https://opensource-demo.orangehrmlive.com',
  loginUrl: '/web/index.php/auth/login',
  dashboardUrl: '/web/index.php/dashboard/index',
  logoutUrl: '/web/index.php/auth/logout'
};

/**
 * Test timeouts and waits (in milliseconds)
 */
export const timeouts = {
  defaultTimeout: 30000,
  shortTimeout: 5000,
  longTimeout: 60000,
  retryInterval: 1000
};

/**
 * Error messages expected in the application
 */
export const expectedErrorMessages = {
  invalidCredentials: 'Invalid credentials',
  requiredField: 'Required',
  sessionExpired: 'Session Timed Out',
  accessDenied: 'Access Denied'
}; 