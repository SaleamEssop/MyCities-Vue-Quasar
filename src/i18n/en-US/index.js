/**
 * English (US) Translations
 * 
 * This is the default language file for MyCities.
 * All user-facing strings should be defined here.
 * 
 * Usage in components:
 *   {{ $t('common.welcome') }}
 *   $t('auth.login.title')
 */

export default {
  // Common strings used across the app
  common: {
    welcome: 'Welcome',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    required: 'Required',
    optional: 'Optional',
  },
  
  // App branding
  app: {
    name: 'MyCities',
    tagline: 'Water Meter Reading',
    version: 'Version {version}',
  },
  
  // Authentication screens
  auth: {
    login: {
      title: 'Sign In',
      email: 'Email',
      password: 'Password',
      submit: 'Sign In',
      demoButton: 'Use Demo Account',
      createAccount: 'Create Account',
      noAccount: "Don't have an account?",
      demoHint: 'Demo credentials: demo@mycities.co.za / demo123',
      errors: {
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        passwordRequired: 'Password is required',
        invalidCredentials: 'Invalid email or password',
      },
    },
    logout: {
      button: 'Logout',
      success: 'You have been logged out',
    },
  },
  
  // Account management
  account: {
    setup: {
      titleCreate: 'Create Account',
      titleEdit: 'Edit Account',
      fullName: 'Full Name',
      company: 'Company',
      phone: 'Phone Number',
      email: 'Email',
      timezone: 'Preferred Timezone',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      newPassword: 'New Password (leave blank to keep current)',
      confirmNewPassword: 'Confirm New Password',
      createButton: 'Create Account',
      saveButton: 'Save Changes',
      errors: {
        fullNameRequired: 'Full name is required',
        phoneRequired: 'Phone number is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        emailExists: 'An account with this email already exists',
        timezoneRequired: 'Timezone is required',
        passwordRequired: 'Password is required',
        passwordMinLength: 'Password must be at least 6 characters',
        passwordMismatch: 'Passwords do not match',
      },
    },
    list: {
      title: 'Accounts',
      count: '{count} account | {count} accounts',
      addButton: 'Add Account',
      empty: 'No accounts yet',
      createFirst: 'Create First Account',
      badges: {
        demo: 'Demo',
        active: 'Active',
      },
      actions: {
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
      },
      deleteConfirm: {
        title: 'Delete Account?',
        message: 'Are you sure you want to delete the account for {name}?',
        warning: 'This action cannot be undone.',
      },
    },
    details: {
      title: 'Account Details',
      created: 'Created',
      unknown: 'Unknown',
    },
  },
  
  // Home screen
  home: {
    greeting: 'Welcome back,',
    totalReadings: 'Total Readings',
    enterReading: 'Enter Reading',
    enterReadingDesc: 'Add a new meter reading',
    viewReadings: 'View Readings',
    viewReadingsDesc: 'See all your readings',
    latestReading: 'Latest Reading',
    timeAgo: {
      justNow: 'Just now',
      minutes: '{count} minute ago | {count} minutes ago',
      hours: '{count} hour ago | {count} hours ago',
      yesterday: 'Yesterday',
      days: '{count} days ago',
    },
  },
  
  // Meter input screen
  meterInput: {
    title: 'Water Meter Reading',
    subtitle: 'Enter your meter reading',
    kiloliters: 'Kiloliters',
    liters: 'Liters',
    instructions: 'Tap a group to activate it, then use the keypad to enter digits.',
    keypad: {
      clear: 'CLEAR',
      enter: 'ENTER',
    },
    success: 'Reading saved successfully',
    error: 'Failed to save reading',
  },
  
  // Readings list screen
  readings: {
    title: 'Readings',
    count: '{count} reading | {count} readings',
    empty: 'No readings yet',
    addFirst: 'Add your first reading',
    addButton: 'Add Reading',
  },
  
  // Reading preview screen
  readingPreview: {
    title: 'Reading Details',
    kiloliters: 'Kiloliters',
    liters: 'Liters',
    timestamp: 'Recorded',
    notFound: 'Reading not found',
  },
  
  // Settings screen
  settings: {
    title: 'Settings',
    sections: {
      account: 'Account',
      data: 'Data Management',
      app: 'App Information',
      session: 'Session',
    },
    manageAccounts: 'Manage Accounts',
    manageAccountsDesc: 'View, edit, or add accounts',
    profile: 'Profile',
    profileDesc: 'View your profile details',
    clearReadings: 'Clear All Readings',
    clearReadingsDesc: 'Delete all stored meter readings',
    version: 'Version',
    about: 'About',
    aboutDesc: 'Learn more about MyCities',
    logout: 'Logout',
    logoutDesc: 'Sign out of your account',
    clearConfirm: {
      title: 'Clear All Readings?',
      message: 'This will permanently delete all stored meter readings. This action cannot be undone.',
      success: 'All readings cleared',
      noReadings: 'No readings to clear',
    },
  },
  
  // About screen
  about: {
    title: 'About MyCities',
    description: 'MyCities is a water meter reading application that helps you track your water consumption.',
    contact: 'Contact',
    website: 'Website',
  },
  
  // Validation messages
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be at most {max} characters',
    passwordMatch: 'Passwords must match',
  },
  
  // Error pages
  errors: {
    notFound: {
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist.',
      homeButton: 'Go Home',
    },
    generic: {
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
      retryButton: 'Try Again',
    },
  },
};



