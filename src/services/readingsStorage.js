/**
 * Readings Storage Service
 * 
 * This module handles reading data storage using localStorage.
 * To replace with backend API:
 * 1. Replace all localStorage calls with API calls
 * 2. Keep the same function signatures
 * 3. Return Promises for async operations
 */

const STORAGE_KEY = 'mycities_readings';

/**
 * Get all readings from storage
 * @returns {Array} Array of reading objects
 */
export function getAllReadings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save a reading
 * @param {Object} reading - Reading object with { id, kiloliters, liters, timestamp, type }
 * @returns {Object} The saved reading with generated ID if not provided
 */
export function saveReading(reading) {
  try {
    const readings = getAllReadings();
    
    // Generate ID if not provided
    const readingWithId = {
      ...reading,
      id: reading.id || `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: reading.timestamp || new Date().toISOString(),
    };
    
    // Add to beginning of array (most recent first)
    readings.unshift(readingWithId);
    
    // Keep only last 100 readings (optional limit)
    const limitedReadings = readings.slice(0, 100);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedReadings));
    
    return readingWithId;
  } catch (error) {
    console.error('Error saving reading to localStorage:', error);
    throw error;
  }
}

/**
 * Get a single reading by ID
 * @param {string} id - Reading ID
 * @returns {Object|null} Reading object or null if not found
 */
export function getReadingById(id) {
  try {
    const readings = getAllReadings();
    return readings.find(r => r.id === id) || null;
  } catch (error) {
    console.error('Error getting reading from localStorage:', error);
    return null;
  }
}

/**
 * Delete a reading by ID
 * @param {string} id - Reading ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteReading(id) {
  try {
    const readings = getAllReadings();
    const filtered = readings.filter(r => r.id !== id);
    
    if (filtered.length === readings.length) {
      return false; // Not found
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting reading from localStorage:', error);
    return false;
  }
}

/**
 * Clear all readings
 */
export function clearAllReadings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing readings from localStorage:', error);
  }
}

/**
 * Get readings count
 * @returns {number} Number of stored readings
 */
export function getReadingsCount() {
  return getAllReadings().length;
}



