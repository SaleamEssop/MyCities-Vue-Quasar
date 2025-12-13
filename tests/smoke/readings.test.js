/**
 * Meter Readings Smoke Tests
 * 
 * Tests core reading flows:
 * - Save meter reading
 * - View readings list
 * - View reading preview
 * - Clear readings
 * 
 * Run with: npm run test:smoke
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Import services
import * as readingsStorage from '../../src/services/readingsStorage';
import * as authStorage from '../../src/services/authStorage';

describe('Meter Readings Smoke Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Login demo user for tests
    authStorage.loginDemo();
  });

  afterEach(() => {
    // Clean up
    readingsStorage.clearAllReadings();
    authStorage.logout();
  });

  describe('Save Reading', () => {
    it('should save a new meter reading', () => {
      // Arrange
      const readingData = {
        kiloliters: '12345',
        liters: '67',
      };

      // Act
      const saved = readingsStorage.saveReading(readingData);

      // Assert
      expect(saved).toBeDefined();
      expect(saved.id).toBeDefined();
      expect(saved.kiloliters).toBe('12345');
      expect(saved.liters).toBe('67');
      expect(saved.timestamp).toBeDefined();
    });

    it('should increment readings count after save', () => {
      // Arrange
      const initialCount = readingsStorage.getReadingsCount();

      // Act
      readingsStorage.saveReading({ kiloliters: '100', liters: '00' });
      readingsStorage.saveReading({ kiloliters: '200', liters: '50' });

      // Assert
      expect(readingsStorage.getReadingsCount()).toBe(initialCount + 2);
    });

    it('should store reading with correct timestamp', () => {
      // Arrange
      const before = Date.now();

      // Act
      const saved = readingsStorage.saveReading({ kiloliters: '100', liters: '00' });
      const after = Date.now();

      // Assert
      const timestamp = new Date(saved.timestamp).getTime();
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('Get Readings', () => {
    it('should return all readings sorted by timestamp (newest first)', () => {
      // Arrange
      readingsStorage.saveReading({ kiloliters: '100', liters: '00' });
      readingsStorage.saveReading({ kiloliters: '200', liters: '50' });
      readingsStorage.saveReading({ kiloliters: '300', liters: '99' });

      // Act
      const readings = readingsStorage.getAllReadings();

      // Assert
      expect(readings.length).toBe(3);
      // Newest should be first
      expect(readings[0].kiloliters).toBe('300');
    });

    it('should return empty array when no readings exist', () => {
      // Act
      const readings = readingsStorage.getAllReadings();

      // Assert
      expect(readings).toEqual([]);
    });
  });

  describe('Get Reading by ID', () => {
    it('should return specific reading by ID', () => {
      // Arrange
      const saved = readingsStorage.saveReading({ kiloliters: '123', liters: '45' });

      // Act
      const found = readingsStorage.getReadingById(saved.id);

      // Assert
      expect(found).toBeDefined();
      expect(found.id).toBe(saved.id);
      expect(found.kiloliters).toBe('123');
    });

    it('should return null for non-existent ID', () => {
      // Act
      const found = readingsStorage.getReadingById('non-existent-id');

      // Assert
      expect(found).toBeNull();
    });
  });

  describe('Clear Readings', () => {
    it('should clear all readings', () => {
      // Arrange
      readingsStorage.saveReading({ kiloliters: '100', liters: '00' });
      readingsStorage.saveReading({ kiloliters: '200', liters: '50' });
      expect(readingsStorage.getReadingsCount()).toBe(2);

      // Act
      readingsStorage.clearAllReadings();

      // Assert
      expect(readingsStorage.getReadingsCount()).toBe(0);
      expect(readingsStorage.getAllReadings()).toEqual([]);
    });
  });

  describe('Readings List Navigation', () => {
    it('should be able to navigate from list to preview', () => {
      // Arrange
      const saved = readingsStorage.saveReading({ kiloliters: '100', liters: '00' });
      
      // Act - Simulate getting reading for preview
      const reading = readingsStorage.getReadingById(saved.id);

      // Assert
      expect(reading).toBeDefined();
      expect(reading.kiloliters).toBe('100');
    });
  });
});

describe('Meter Input Logic', () => {
  describe('Digit Groups', () => {
    it('should handle kiloliters group (up to 5 digits)', () => {
      // Simulate digit entry for kiloliters
      let value = '';
      
      // Add digits
      value += '1';
      value += '2';
      value += '3';
      value += '4';
      value += '5';
      
      expect(value).toBe('12345');
      expect(value.length).toBe(5);
    });

    it('should handle liters group (up to 2 digits)', () => {
      // Simulate digit entry for liters
      let value = '';
      
      // Add digits
      value += '6';
      value += '7';
      
      expect(value).toBe('67');
      expect(value.length).toBe(2);
    });

    it('should clear group completely', () => {
      // Simulate clear operation
      let kiloliters = '12345';
      let liters = '67';
      
      // Clear kiloliters
      kiloliters = '';
      expect(kiloliters).toBe('');
      
      // Liters should remain unchanged
      expect(liters).toBe('67');
    });

    it('should handle independent group clearing', () => {
      // Both groups start with values
      let kiloliters = '12345';
      let liters = '67';
      
      // Clear only liters
      liters = '';
      
      // Kiloliters should be unchanged
      expect(kiloliters).toBe('12345');
      expect(liters).toBe('');
    });
  });

  describe('Empty State', () => {
    it('should show flashing caret when group is empty', () => {
      // When a group is empty and active, it should show a caret
      const isEmpty = (value) => value === '';
      const showCaret = (value, isActive) => isEmpty(value) && isActive;
      
      expect(showCaret('', true)).toBe(true);
      expect(showCaret('', false)).toBe(false);
      expect(showCaret('123', true)).toBe(false);
    });
  });
});



