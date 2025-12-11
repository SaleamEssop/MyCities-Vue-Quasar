/**
 * Setup API Service
 * 
 * Connects the webapp to the Laravel backend for:
 * - Region and tariff listing
 * - Tariff details with editable costs
 * - Bill preview and calculation
 * - Account management
 * 
 * All billing calculations come from the backend BillingEngine.
 */

// API base URL - change this when deploying
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error ${response.status}`,
        data: null,
      };
    }
    
    return {
      success: data.success !== false,
      data: data.data || data,
      error: null,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error.message || 'Network error',
      data: null,
    };
  }
}

/**
 * Get all available regions
 */
export async function getRegions() {
  return apiRequest('/setup/regions');
}

/**
 * Get tariffs for a specific region
 * @param {number} regionId - Region ID
 */
export async function getTariffsForRegion(regionId) {
  return apiRequest(`/setup/regions/${regionId}/tariffs`);
}

/**
 * Get full tariff details including tiers and editable costs
 * @param {number} tariffId - Tariff template ID
 */
export async function getTariffDetails(tariffId) {
  return apiRequest(`/setup/tariffs/${tariffId}`);
}

/**
 * Preview a bill calculation using a tariff template
 * @param {number} tariffId - Tariff template ID
 * @param {object} params - Optional parameters (water_used, electricity_used, customer_costs)
 */
export async function previewBill(tariffId, params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.water_used !== undefined) {
    queryParams.append('water_used', params.water_used);
  }
  if (params.electricity_used !== undefined) {
    queryParams.append('electricity_used', params.electricity_used);
  }
  if (params.vat_rate !== undefined) {
    queryParams.append('vat_rate', params.vat_rate);
  }
  if (params.rates_rebate !== undefined) {
    queryParams.append('rates_rebate', params.rates_rebate);
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/setup/tariffs/${tariffId}/preview-bill${queryString ? '?' + queryString : ''}`;
  
  return apiRequest(endpoint);
}

/**
 * Get the current user's account
 */
export async function getCurrentAccount() {
  return apiRequest('/user-account/current');
}

/**
 * Create a new account for the user
 * @param {object} accountData - Account data including:
 *   - tariff_template_id: Required tariff template ID
 *   - account_name: Account description (e.g., "Main House")
 *   - billing_day: Day of month for billing (1-31)
 *   - site_title: Site name
 *   - site_address: Full address (from Google Places)
 *   - address_lat: Latitude (optional)
 *   - address_lng: Longitude (optional)
 *   - water_email: Email for water department
 *   - electricity_email: Email for electricity department
 *   - customer_costs: Array of editable costs [{title, value}]
 *   - user: User details for new registration {name, email, phone, company, timezone, password}
 */
export async function createAccount(accountData) {
  return apiRequest('/user-account/create', {
    method: 'POST',
    body: JSON.stringify(accountData),
  });
}

/**
 * Update user's account settings
 * @param {object} accountData - Account data to update
 */
export async function updateAccount(accountData) {
  return apiRequest('/user-account/update', {
    method: 'POST',
    body: JSON.stringify(accountData),
  });
}

/**
 * Get the current bill for the user's account
 */
export async function getCurrentBill() {
  return apiRequest('/user-account/bill');
}

/**
 * Login user and get auth token
 * @param {string} email 
 * @param {string} password 
 */
export async function login(email, password) {
  const response = await apiRequest('/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.success && response.data?.token) {
    localStorage.setItem('auth_token', response.data.token);
  }
  
  return response;
}

/**
 * Logout user
 */
export async function logout() {
  const response = await apiRequest('/user/logout', {
    method: 'POST',
  });
  
  localStorage.removeItem('auth_token');
  
  return response;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem('auth_token');
}

/**
 * Calculate read_day from billing_day
 * Read day is typically 5 days before billing day
 * @param {number} billingDay - Billing day (1-31)
 * @returns {number} Read day
 */
export function calculateReadDay(billingDay) {
  return Math.max(1, billingDay - 5);
}

export default {
  getRegions,
  getTariffsForRegion,
  getTariffDetails,
  previewBill,
  getCurrentAccount,
  createAccount,
  updateAccount,
  getCurrentBill,
  login,
  logout,
  isAuthenticated,
  calculateReadDay,
};

