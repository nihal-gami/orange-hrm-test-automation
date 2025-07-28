/**
 * Test data for authentication test scenarios
 * Following data-driven testing approach as per automation rules
 */

export const testData = {
  // Valid credentials for positive testing
  validCredentials: {
    admin: {
      username: 'Admin',
      password: 'admin123',
      expectedRole: 'Admin',
      description: 'Default admin user'
    }
  },

  // Invalid credentials for negative testing
  invalidCredentials: [
    {
      username: 'InvalidUser',
      password: 'admin123',
      description: 'Invalid username with valid password'
    },
    {
      username: 'Admin',
      password: 'wrongpassword',
      description: 'Valid username with invalid password'
    },
    {
      username: 'InvalidUser',
      password: 'wrongpassword',
      description: 'Both username and password invalid'
    },
    {
      username: '',
      password: 'admin123',
      description: 'Empty username with valid password'
    },
    {
      username: 'Admin',
      password: '',
      description: 'Valid username with empty password'
    },
    {
      username: '',
      password: '',
      description: 'Both fields empty'
    },
    {
      username: '   ',
      password: 'admin123',
      description: 'Whitespace username'
    },
    {
      username: 'Admin',
      password: '   ',
      description: 'Whitespace password'
    },
    {
      username: 'admin',
      password: 'admin123',
      description: 'Lowercase username (case sensitivity test)'
    },
    {
      username: 'Admin',
      password: 'ADMIN123',
      description: 'Uppercase password (case sensitivity test)'
    }
  ],

  // SQL injection payloads for security testing
  sqlInjectionPayloads: [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "' OR '1'='1' --",
    "'; DELETE FROM users; --",
    "admin'--",
    "admin' /*",
    "' UNION SELECT * FROM users --",
    "' OR 1=1 --",
    "') OR '1'='1' --",
    "'; INSERT INTO users VALUES ('hacker', 'password'); --"
  ],

  // XSS payloads for security testing
  xssPayloads: [
    '<script>alert("XSS")</script>',
    'javascript:alert("XSS")',
    '<img src="x" onerror="alert(\'XSS\')">',
    '<svg onload="alert(\'XSS\')">',
    '"><script>alert("XSS")</script>',
    '<iframe src="javascript:alert(\'XSS\')"></iframe>',
    '<body onload="alert(\'XSS\')">',
    '<input type="text" value="XSS" onfocus="alert(\'XSS\')" autofocus>',
    '"><img src=x onerror=alert("XSS")>',
    '<script>document.location="http://evil.com"</script>'
  ],

  // Edge case test data
  edgeCases: [
    {
      username: 'a'.repeat(1000), // Very long username
      password: 'admin123',
      description: 'Extremely long username'
    },
    {
      username: 'Admin',
      password: 'a'.repeat(1000), // Very long password
      description: 'Extremely long password'
    },
    {
      username: 'Ädmin', // Unicode characters
      password: 'admin123',
      description: 'Username with unicode characters'
    },
    {
      username: 'Admin',
      password: 'αdmin123', // Unicode in password
      description: 'Password with unicode characters'
    },
    {
      username: 'Admin\n\r\t', // Control characters
      password: 'admin123',
      description: 'Username with control characters'
    },
    {
      username: 'Admin',
      password: 'admin123\n\r\t', // Control characters
      description: 'Password with control characters'
    }
  ],

  // Role-based access test data
  userRoles: [
    {
      role: 'Admin',
      expectedMenus: ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'Performance'],
      restrictedUrls: [], // Admin has access to all
      description: 'Administrator with full access'
    },
    {
      role: 'ESS User',
      expectedMenus: ['My Info', 'Leave', 'Time'],
      restrictedUrls: ['/admin', '/recruitment'],
      description: 'Employee Self Service user with limited access'
    },
    {
      role: 'Supervisor',
      expectedMenus: ['PIM', 'Leave', 'Time', 'Performance'],
      restrictedUrls: ['/admin'],
      description: 'Supervisor with team management access'
    }
  ],

  // URLs for unauthorized access testing
  restrictedUrls: [
    '/web/index.php/admin/viewSystemUsers',
    '/web/index.php/admin/viewOrganizationGeneralInformation',
    '/web/index.php/admin/listJobTitles',
    '/web/index.php/admin/viewCompanyStructure',
    '/web/index.php/recruitment/viewJobVacancy',
    '/web/index.php/performance/searchEvaluatePerformanceReview'
  ],

  // Session timeout simulation data
  sessionTestData: {
    timeoutDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    warningTime: 25 * 60 * 1000, // Warning at 25 minutes
    actions: [
      'Navigate to PIM',
      'Navigate to Leave',
      'Navigate to Admin',
      'View employee list',
      'Apply for leave'
    ]
  },

  // Error messages to verify
  expectedErrorMessages: {
    invalidCredentials: 'Invalid credentials',
    emptyFields: 'Username and password are required',
    sessionExpired: 'Session expired',
    accessDenied: 'Access denied',
    accountLocked: 'Account locked'
  },

  // Password security test data
  passwordSecurity: {
    commonPasswords: [
      '123456',
      'password',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein'
    ],
    weakPasswords: [
      'a',
      '12',
      'abc',
      '   ',
      'aaaaaaa'
    ],
    specialCharacterPasswords: [
      'p@ssw0rd!',
      'admin@123',
      'test#$%^',
      'pass*word',
      'admin&123'
    ]
  },

  // Browser and device specific test data
  browserSpecific: {
    autoComplete: {
      username: 'Admin',
      password: 'admin123'
    },
    copyPaste: {
      username: 'CopiedAdmin',
      password: 'CopiedPassword123'
    }
  }
};

// Helper functions for test data
export const getRandomInvalidCredential = () => {
  const randomIndex = Math.floor(Math.random() * testData.invalidCredentials.length);
  return testData.invalidCredentials[randomIndex];
};

export const getRandomSQLInjectionPayload = () => {
  const randomIndex = Math.floor(Math.random() * testData.sqlInjectionPayloads.length);
  return testData.sqlInjectionPayloads[randomIndex];
};

export const getRandomXSSPayload = () => {
  const randomIndex = Math.floor(Math.random() * testData.xssPayloads.length);
  return testData.xssPayloads[randomIndex];
}; 