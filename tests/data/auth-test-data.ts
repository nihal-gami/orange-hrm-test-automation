export const AuthTestData = {
  validCredentials: {
    username: 'Admin',
    password: 'admin123'
  },
  
  invalidCredentials: [
    {
      scenario: 'Invalid username with valid password',
      username: 'InvalidUser',
      password: 'admin123',
      expectedError: 'Invalid credentials'
    },
    {
      scenario: 'Valid username with invalid password',
      username: 'Admin',
      password: 'wrongpassword',
      expectedError: 'Invalid credentials'
    },
    {
      scenario: 'Both username and password invalid',
      username: 'InvalidUser',
      password: 'wrongpassword',
      expectedError: 'Invalid credentials'
    },
    {
      scenario: 'Empty username and password',
      username: '',
      password: '',
      expectedError: 'Required'
    },
    {
      scenario: 'Empty username with valid password',
      username: '',
      password: 'admin123',
      expectedError: 'Required'
    },
    {
      scenario: 'Valid username with empty password',
      username: 'Admin',
      password: '',
      expectedError: 'Required'
    }
  ],

  securityTestInputs: [
    {
      scenario: 'SQL injection in username',
      username: "admin' OR '1'='1",
      password: 'admin123',
      expectedError: 'Invalid credentials'
    },
    {
      scenario: 'SQL injection in password',
      username: 'Admin',
      password: "password' OR '1'='1",
      expectedError: 'Invalid credentials'
    },
    {
      scenario: 'XSS attempt in username',
      username: '<script>alert("xss")</script>',
      password: 'admin123',
      expectedError: 'Invalid credentials'
    },
    {
      scenario: 'Script injection in password',
      username: 'Admin',
      password: '<script>alert("xss")</script>',
      expectedError: 'Invalid credentials'
    }
  ],

  passwordMaskingTest: {
    testPassword: 'TestPassword123!',
    expectedMaskedDisplay: '••••••••••••••••'
  },

  sessionTestData: {
    protectedUrls: [
      '/web/index.php/dashboard/index',
      '/web/index.php/admin/viewSystemUsers',
      '/web/index.php/pim/viewEmployeeList',
      '/web/index.php/leave/viewLeaveList'
    ]
  }
}; 