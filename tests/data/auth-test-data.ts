export interface LoginCredentials {
  username: string;
  password: string;
  description: string;
  expectedResult: 'success' | 'error';
}

export interface TestUser {
  username: string;
  password: string;
  role: string;
  permissions: string[];
}

// Valid credentials
export const validCredentials: LoginCredentials = {
  username: 'Admin',
  password: 'admin123',
  description: 'Valid admin credentials',
  expectedResult: 'success'
};

// Invalid credentials test data
export const invalidCredentials: LoginCredentials[] = [
  {
    username: 'InvalidUser',
    password: 'admin123',
    description: 'Invalid username, valid password',
    expectedResult: 'error'
  },
  {
    username: 'Admin',
    password: 'wrongpassword',
    description: 'Valid username, invalid password',
    expectedResult: 'error'
  },
  {
    username: 'InvalidUser',
    password: 'wrongpassword',
    description: 'Invalid username and password',
    expectedResult: 'error'
  },
  {
    username: '',
    password: 'admin123',
    description: 'Empty username, valid password',
    expectedResult: 'error'
  },
  {
    username: 'Admin',
    password: '',
    description: 'Valid username, empty password',
    expectedResult: 'error'
  },
  {
    username: '',
    password: '',
    description: 'Empty username and password',
    expectedResult: 'error'
  }
];

// Test users with different roles
export const testUsers: TestUser[] = [
  {
    username: 'Admin',
    password: 'admin123',
    role: 'Admin',
    permissions: ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'Performance']
  }
];

// Error messages expected for invalid login attempts
export const expectedErrorMessages = {
  invalidCredentials: 'Invalid credentials',
  requiredFields: 'Required',
  loginFailed: 'Login Failed'
};

// Test URLs
export const testURLs = {
  baseURL: 'https://opensource-demo.orangehrmlive.com',
  loginURL: '/web/index.php/auth/login',
  dashboardURL: '/web/index.php/dashboard/index'
};

// Security test data
export const securityTestData = {
  passwordFieldType: 'password',
  expectedMaskedCharacter: '•',
  sensitiveDataPatterns: [
    /password/i,
    /admin123/i,
    /credentials/i
  ]
}; 