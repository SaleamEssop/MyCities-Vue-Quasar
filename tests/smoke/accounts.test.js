/**
 * Account Management Smoke Tests
 * 
 * Tests account CRUD operations:
 * - List accounts
 * - Edit account
 * - Delete account
 * - Persistence
 * 
 * Run with: npm run test:smoke
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import services
import * as authStorage from '../../src/services/authStorage';

describe('Account Management Smoke Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up
    authStorage.logout();
  });

  describe('List Accounts', () => {
    it('should list all accounts including demo', () => {
      // Demo account is auto-created on first access
      authStorage.loginDemo();
      
      // Act
      const accounts = authStorage.getAllAccounts();

      // Assert
      expect(accounts.length).toBeGreaterThanOrEqual(1);
      expect(accounts.some(a => a.isDemo)).toBe(true);
    });

    it('should include newly created accounts in list', () => {
      // Arrange
      const accountData = {
        fullName: 'New User',
        email: 'newuser@example.com',
        password: 'test123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      };

      // Act
      authStorage.createAccount(accountData);
      const accounts = authStorage.getAllAccounts();

      // Assert
      expect(accounts.some(a => a.email === 'newuser@example.com')).toBe(true);
    });
  });

  describe('Edit Account', () => {
    it('should update account details', () => {
      // Arrange
      const account = authStorage.createAccount({
        fullName: 'Original Name',
        email: 'edit@example.com',
        password: 'test123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      });

      // Act
      const updated = authStorage.updateAccount(account.id, {
        fullName: 'Updated Name',
        company: 'New Company',
      });

      // Assert
      expect(updated.fullName).toBe('Updated Name');
      expect(updated.company).toBe('New Company');
      expect(updated.email).toBe('edit@example.com'); // Unchanged
    });

    it('should persist account changes', () => {
      // Arrange
      const account = authStorage.createAccount({
        fullName: 'Persist Test',
        email: 'persist@example.com',
        password: 'test123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      });

      // Act
      authStorage.updateAccount(account.id, { fullName: 'Persisted Name' });

      // Simulate reload by fetching again
      const fetched = authStorage.getAccountById(account.id);

      // Assert
      expect(fetched.fullName).toBe('Persisted Name');
    });

    it('should not allow editing demo account email', () => {
      // Arrange
      authStorage.loginDemo();
      const accounts = authStorage.getAllAccounts();
      const demoAccount = accounts.find(a => a.isDemo);

      // Act
      authStorage.updateAccount(demoAccount.id, {
        email: 'newemail@example.com',
        fullName: 'New Demo Name',
      });

      // Assert - email should remain unchanged
      const updated = authStorage.getAccountById(demoAccount.id);
      expect(updated.email).toBe('demo@mycities.co.za');
      expect(updated.fullName).toBe('New Demo Name'); // Name can change
    });
  });

  describe('Delete Account', () => {
    it('should delete non-demo account', () => {
      // Arrange
      const account = authStorage.createAccount({
        fullName: 'Delete Test',
        email: 'delete@example.com',
        password: 'test123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      });

      // Act
      const deleted = authStorage.deleteAccount(account.id);

      // Assert
      expect(deleted).toBe(true);
      expect(authStorage.getAccountById(account.id)).toBeNull();
    });

    it('should not delete demo account', () => {
      // Arrange
      authStorage.loginDemo();
      const accounts = authStorage.getAllAccounts();
      const demoAccount = accounts.find(a => a.isDemo);

      // Act
      const deleted = authStorage.deleteAccount(demoAccount.id);

      // Assert
      expect(deleted).toBe(false);
      expect(authStorage.getAccountById(demoAccount.id)).toBeDefined();
    });

    it('should logout if deleted account was logged in', () => {
      // Arrange
      const account = authStorage.createAccount({
        fullName: 'Logout Test',
        email: 'logout@example.com',
        password: 'test123',
        phone: '+27 12 345 6789',
        timezone: 'Africa/Johannesburg',
      });
      authStorage.login(account.email, 'test123');
      expect(authStorage.isAuthenticated()).toBe(true);

      // Act
      authStorage.deleteAccount(account.id);

      // Assert
      expect(authStorage.isAuthenticated()).toBe(false);
    });
  });

  describe('Account Validation', () => {
    it('should validate email format', () => {
      expect(authStorage.isValidEmail('test@example.com')).toBe(true);
      expect(authStorage.isValidEmail('invalid-email')).toBe(false);
      expect(authStorage.isValidEmail('')).toBe(false);
      expect(authStorage.isValidEmail('test@')).toBe(false);
    });

    it('should validate password strength', () => {
      const valid = authStorage.validatePassword('test123');
      expect(valid.valid).toBe(true);

      const tooShort = authStorage.validatePassword('abc');
      expect(tooShort.valid).toBe(false);
      expect(tooShort.message).toContain('6 characters');

      const empty = authStorage.validatePassword('');
      expect(empty.valid).toBe(false);
    });
  });
});



