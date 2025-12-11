/**
 * Authentication Storage Service
 * 
 * Handles user authentication and account management using localStorage.
 * To replace with backend API, swap localStorage calls with fetch/axios.
 */

const ACCOUNTS_KEY = 'mycities_accounts';
const SESSION_KEY = 'mycities_session';

// Demo account for testing
const DEMO_ACCOUNT = {
  id: 'demo_user_001',
  email: 'demo@mycities.co.za',
  password: 'demo123',
  fullName: 'Demo User',
  company: 'MyCities Demo',
  phone: '+27 11 123 4567',
  timezone: 'Africa/Johannesburg',
  createdAt: '2024-01-01T00:00:00.000Z',
  isDemo: true,
};

/**
 * Initialize accounts with demo account if empty
 */
function initializeAccounts() {
  const accounts = getAllAccounts();
  if (!accounts.find(a => a.id === DEMO_ACCOUNT.id)) {
    accounts.push(DEMO_ACCOUNT);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

/**
 * Get all accounts from storage
 * @returns {Array} Array of account objects
 */
export function getAllAccounts() {
  try {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading accounts:', error);
    return [];
  }
}

/**
 * Get account by ID
 * @param {string} id - Account ID
 * @returns {Object|null} Account object or null
 */
export function getAccountById(id) {
  const accounts = getAllAccounts();
  return accounts.find(a => a.id === id) || null;
}

/**
 * Get account by email
 * @param {string} email - Account email
 * @returns {Object|null} Account object or null
 */
export function getAccountByEmail(email) {
  const accounts = getAllAccounts();
  return accounts.find(a => a.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Create a new account
 * @param {Object} accountData - Account data
 * @returns {Object} Created account with generated ID
 */
export function createAccount(accountData) {
  const accounts = getAllAccounts();
  
  // Check if email already exists
  if (accounts.find(a => a.email.toLowerCase() === accountData.email.toLowerCase())) {
    throw new Error('An account with this email already exists');
  }
  
  const newAccount = {
    ...accountData,
    id: `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    isDemo: false,
  };
  
  accounts.push(newAccount);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  
  return newAccount;
}

/**
 * Update an existing account
 * @param {string} id - Account ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated account or null if not found
 */
export function updateAccount(id, updates) {
  const accounts = getAllAccounts();
  const index = accounts.findIndex(a => a.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Don't allow changing demo account's core fields
  if (accounts[index].isDemo) {
    delete updates.email;
    delete updates.password;
    delete updates.isDemo;
  }
  
  accounts[index] = {
    ...accounts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return accounts[index];
}

/**
 * Delete an account
 * @param {string} id - Account ID
 * @returns {boolean} True if deleted, false if not found or is demo
 */
export function deleteAccount(id) {
  const accounts = getAllAccounts();
  const account = accounts.find(a => a.id === id);
  
  // Don't allow deleting demo account
  if (!account || account.isDemo) {
    return false;
  }
  
  const filtered = accounts.filter(a => a.id !== id);
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));
  
  // If deleted account was logged in, clear session
  const session = getSession();
  if (session && session.accountId === id) {
    logout();
  }
  
  return true;
}

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Session object with account info
 * @throws {Error} If credentials are invalid
 */
export function login(email, password) {
  initializeAccounts();
  
  const account = getAccountByEmail(email);
  
  if (!account) {
    throw new Error('No account found with this email');
  }
  
  if (account.password !== password) {
    throw new Error('Invalid password');
  }
  
  // Create session
  const session = {
    accountId: account.id,
    email: account.email,
    fullName: account.fullName,
    isDemo: account.isDemo || false,
    loginAt: new Date().toISOString(),
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Login with demo account
 * @returns {Object} Session object
 */
export function loginDemo() {
  initializeAccounts();
  return login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
}

/**
 * Get current session
 * @returns {Object|null} Session object or null if not logged in
 */
export function getSession() {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if logged in
 */
export function isAuthenticated() {
  return getSession() !== null;
}

/**
 * Logout current user
 */
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Get current logged-in account
 * @returns {Object|null} Account object or null
 */
export function getCurrentAccount() {
  const session = getSession();
  if (!session) {
    return null;
  }
  return getAccountById(session.accountId);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, message: string }
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
}

// Initialize on module load
initializeAccounts();


