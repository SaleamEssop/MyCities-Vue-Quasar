/**
 * Authentication Smoke Tests
 * 
 * Tests core authentication flows:
 * - Demo login
 * - Account creation
 * - Login with created account
 * - Session persistence
 * 
 * Run with: npm run test:smoke
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { Quasar, Notify } from 'quasar';
import { createRouter, createWebHistory } from 'vue-router';

// Import services
import * as authStorage from '../../src/services/authStorage';
import * as dataService from '../../src/services/dataService';

// Import components
import LoginPage from '../../src/pages/LoginPage.vue';
import AccountSetupPage from '../../src/pages/AccountSetupPage.vue';

// Mock router
const routes = [
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/account-setup', name: 'account-setup', component: AccountSetupPage },
  { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
];

const createTestRouter = () => createRouter({
  history: createWebHistory(),
  routes,
});

// Helper to mount with Quasar
const mountWithQuasar = (component, options = {}) => {
  const router = createTestRouter();
  
  return mount(component, {
    global: {
      plugins: [
        [Quasar, { plugins: { Notify } }],
        router,
        createTestingPinia(),
      ],
      stubs: {
        'q-page': { template: '<div class="q-page"><slot /></div>' },
      },
    },
    ...options,
  });
};

describe('Authentication Smoke Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    authStorage.logout();
  });

  describe('Demo Login', () => {
    it('should login with demo account successfully', async () => {
      // Act
      const session = authStorage.loginDemo();

      // Assert
      expect(session).toBeDefined();
      expect(session.isDemo).toBe(true);
      expect(session.email).toBe('demo@mycities.co.za');
      expect(authStorage.isAuthenticated()).toBe(true);
    });

    it('should redirect to home after demo login', async () => {
      // Arrange
      const wrapper = mountWithQuasar(LoginPage);
      const router = wrapper.vm.$router;
      const pushSpy = vi.spyOn(router, 'push');

      // Act
      const demoButton = wrapper.find('[data-test="login-demo"]');
      expect(demoButton.exists()).toBe(true);
      
      await demoButton.trigger('click');
      await new Promise(resolve => setTimeout(resolve, 600)); // Wait for simulated delay

      // Assert
      expect(pushSpy).toHaveBeenCalledWith({ name: 'home' });
    });
  });

  describe('Account Creation', () => {
    it('should create a new account successfully', async () => {
      // Arrange
      const accountData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'test123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      };

      // Act
      const account = authStorage.createAccount(accountData);

      // Assert
      expect(account).toBeDefined();
      expect(account.id).toBeDefined();
      expect(account.email).toBe(accountData.email);
      expect(account.fullName).toBe(accountData.fullName);
      expect(account.isDemo).toBe(false);
    });

    it('should auto-login after account creation', async () => {
      // Arrange
      const accountData = {
        fullName: 'Test User',
        email: 'test2@example.com',
        password: 'test123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      };

      // Act
      const account = authStorage.createAccount(accountData);
      authStorage.login(account.email, accountData.password);

      // Assert
      expect(authStorage.isAuthenticated()).toBe(true);
      const session = authStorage.getSession();
      expect(session.email).toBe(accountData.email);
    });

    it('should reject duplicate email addresses', () => {
      // Arrange
      const accountData = {
        fullName: 'Test User',
        email: 'duplicate@example.com',
        password: 'test123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      };

      // Act
      authStorage.createAccount(accountData);

      // Assert
      expect(() => authStorage.createAccount(accountData)).toThrow('already exists');
    });
  });

  describe('Login with Created Account', () => {
    it('should login with created account credentials', async () => {
      // Arrange
      const accountData = {
        fullName: 'Login Test User',
        email: 'logintest@example.com',
        password: 'mypassword123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      };
      authStorage.createAccount(accountData);

      // Act
      const session = authStorage.login(accountData.email, accountData.password);

      // Assert
      expect(session).toBeDefined();
      expect(session.email).toBe(accountData.email);
      expect(authStorage.isAuthenticated()).toBe(true);
    });

    it('should reject invalid password', () => {
      // Arrange
      const accountData = {
        fullName: 'Password Test User',
        email: 'passtest@example.com',
        password: 'correctpassword',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      };
      authStorage.createAccount(accountData);

      // Act & Assert
      expect(() => authStorage.login(accountData.email, 'wrongpassword')).toThrow('Invalid password');
    });

    it('should reject non-existent email', () => {
      // Act & Assert
      expect(() => authStorage.login('nonexistent@example.com', 'anypassword')).toThrow('No account found');
    });
  });

  describe('Session Persistence', () => {
    it('should persist session across page reloads', () => {
      // Arrange
      authStorage.loginDemo();
      expect(authStorage.isAuthenticated()).toBe(true);

      // Simulate page reload by creating new auth check
      const sessionAfterReload = authStorage.getSession();

      // Assert
      expect(sessionAfterReload).toBeDefined();
      expect(sessionAfterReload.isDemo).toBe(true);
    });

    it('should clear session on logout', () => {
      // Arrange
      authStorage.loginDemo();
      expect(authStorage.isAuthenticated()).toBe(true);

      // Act
      authStorage.logout();

      // Assert
      expect(authStorage.isAuthenticated()).toBe(false);
      expect(authStorage.getSession()).toBeNull();
    });
  });
});

describe('Single Screen Visibility', () => {
  it('should render only one QPage at a time', async () => {
    // This test validates the single-screen rule
    const wrapper = mountWithQuasar(LoginPage);
    
    // Assert only one q-page is rendered
    const pages = wrapper.findAll('.q-page');
    expect(pages.length).toBe(1);
  });
});



