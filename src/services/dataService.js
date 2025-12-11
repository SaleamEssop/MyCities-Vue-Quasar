/**
 * Data Service - Abstraction Layer
 * 
 * This module provides a unified interface for data operations.
 * Currently uses localStorage as the backend, but can be swapped
 * to a real API by replacing the implementation functions.
 * 
 * TO SWAP TO A REAL API:
 * 1. Replace localStorage calls with fetch/axios calls
 * 2. Update the API_BASE_URL constant
 * 3. Add authentication headers in makeRequest()
 * 4. Handle async responses appropriately
 * 
 * @module dataService
 */

import * as authStorage from './authStorage';
import * as readingsStorage from './readingsStorage';

// Configuration - change this when connecting to real backend
const CONFIG = {
  // Set to your API URL when ready (e.g., 'https://api.mycities.co.za/v1')
  API_BASE_URL: null, // null = use localStorage
  USE_MOCK_DELAY: true, // Simulate network latency in dev
  MOCK_DELAY_MS: 300,
};

/**
 * Simulates network delay for realistic UX testing
 * @private
 */
const simulateDelay = async () => {
  if (CONFIG.USE_MOCK_DELAY && !CONFIG.API_BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, CONFIG.MOCK_DELAY_MS));
  }
};

/**
 * Makes an API request (placeholder for real API integration)
 * @private
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
const makeRequest = async (endpoint, options = {}) => {
  if (!CONFIG.API_BASE_URL) {
    throw new Error('API not configured - using localStorage');
  }
  
  const url = `${CONFIG.API_BASE_URL}${endpoint}`;
  const session = authStorage.getSession();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { 'Authorization': `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
};

// =============================================================================
// AUTHENTICATION
// =============================================================================

/**
 * Login user with credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Session object
 */
export const login = async (email, password) => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
  
  return authStorage.login(email, password);
};

/**
 * Login with demo account
 * @returns {Promise<Object>} Session object
 */
export const loginDemo = async () => {
  await simulateDelay();
  return authStorage.loginDemo();
};

/**
 * Login with demo admin account
 * @returns {Promise<Object>} Session object
 */
export const loginDemoAdmin = async () => {
  await simulateDelay();
  return authStorage.loginDemoAdmin();
};

/**
 * Check if current user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  return authStorage.isAdmin();
};

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    await makeRequest('/auth/logout', { method: 'POST' }).catch(() => {});
  }
  
  authStorage.logout();
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return authStorage.isAuthenticated();
};

/**
 * Get current session
 * @returns {Object|null}
 */
export const getSession = () => {
  return authStorage.getSession();
};

/**
 * Get current logged-in account
 * @returns {Object|null}
 */
export const getCurrentAccount = () => {
  return authStorage.getCurrentAccount();
};

// =============================================================================
// ACCOUNTS
// =============================================================================

/**
 * Get all accounts
 * @returns {Promise<Array>}
 */
export const getAccounts = async () => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    return makeRequest('/accounts');
  }
  
  return authStorage.getAllAccounts();
};

/**
 * Get account by ID
 * @param {string} id - Account ID
 * @returns {Promise<Object|null>}
 */
export const getAccountById = async (id) => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    return makeRequest(`/accounts/${id}`);
  }
  
  return authStorage.getAccountById(id);
};

/**
 * Create new account
 * @param {Object} accountData - Account data
 * @returns {Promise<Object>} Created account
 */
export const createAccount = async (accountData) => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    return makeRequest('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }
  
  return authStorage.createAccount(accountData);
};

/**
 * Update account
 * @param {string} id - Account ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated account
 */
export const updateAccount = async (id, updates) => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    return makeRequest(`/accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
  
  return authStorage.updateAccount(id, updates);
};

/**
 * Delete account
 * @param {string} id - Account ID
 * @returns {Promise<boolean>}
 */
export const deleteAccount = async (id) => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    await makeRequest(`/accounts/${id}`, { method: 'DELETE' });
    return true;
  }
  
  return authStorage.deleteAccount(id);
};

// =============================================================================
// METER READINGS
// =============================================================================

/**
 * Get all readings
 * @returns {Promise<Array>}
 */
export const getReadings = async () => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    return makeRequest('/readings');
  }
  
  return readingsStorage.getAllReadings();
};

/**
 * Get reading by ID
 * @param {string} id - Reading ID
 * @returns {Promise<Object|null>}
 */
export const getReadingById = async (id) => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    return makeRequest(`/readings/${id}`);
  }
  
  return readingsStorage.getReadingById(id);
};

/**
 * Save new reading
 * @param {Object} readingData - Reading data (kiloliters, liters, etc.)
 * @returns {Promise<Object>} Saved reading
 */
export const saveReading = async (readingData) => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    return makeRequest('/readings', {
      method: 'POST',
      body: JSON.stringify(readingData),
    });
  }
  
  return readingsStorage.saveReading(readingData);
};

/**
 * Get readings count
 * @returns {Promise<number>}
 */
export const getReadingsCount = async () => {
  if (CONFIG.API_BASE_URL) {
    const readings = await makeRequest('/readings/count');
    return readings.count;
  }
  
  return readingsStorage.getReadingsCount();
};

/**
 * Clear all readings
 * @returns {Promise<void>}
 */
export const clearAllReadings = async () => {
  await simulateDelay();
  
  if (CONFIG.API_BASE_URL) {
    await makeRequest('/readings', { method: 'DELETE' });
    return;
  }
  
  return readingsStorage.clearAllReadings();
};

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

export const validators = {
  isValidEmail: authStorage.isValidEmail,
  validatePassword: authStorage.validatePassword,
};

export const config = {
  isUsingApi: () => !!CONFIG.API_BASE_URL,
  setApiUrl: (url) => { CONFIG.API_BASE_URL = url; },
  setMockDelay: (enabled, ms = 300) => {
    CONFIG.USE_MOCK_DELAY = enabled;
    CONFIG.MOCK_DELAY_MS = ms;
  },
};


